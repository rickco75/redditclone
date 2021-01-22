import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from "next/router";
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { useIsAuth } from '../../../utils/uselsAuth';
import { withApollo } from '../../../utils/withApollo';

export const EditPost = ({}) => {
  useIsAuth();

  const router = useRouter();
  const intId = useGetIntId()

  const {data, loading } = usePostQuery({      
    skip: intId === -1,
    variables: {
      id: intId
    }
  })

  const [updatePost] = useUpdatePostMutation();

  if (loading){
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    )
  }

  if (!data?.post){
    return (
      <Layout>
        <Box>
          Could not locate post
        </Box>
      </Layout>

    )
  }

	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ title: data.post.title, text: data.post.text }}
				onSubmit={async (values) => {
					const { errors } = await updatePost({variables: {id: intId, ...values} });
					if (!errors) {
						router.back();
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							required
							name='title'
							placeholder='title'
              label='Title'
						/>
						<Box mt={4} mb={4}>
							<InputField
                textarea
                required
								name='text'
								placeholder='text...'
                label='Body'
							/>
						</Box>
						<Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
							Update Post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withApollo({ ssr: false })(EditPost);
