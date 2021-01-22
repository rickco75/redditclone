import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

export const ForgotPassword: React.FC<{}> = ({}) => {
	const [complete, setComplete] = useState(false);

	const [forgotPassword] = useForgotPasswordMutation();

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values) => {
					await forgotPassword({variables: values});
					setComplete(true);
				}}>
				{({ isSubmitting }) =>
					complete ? (
						<Box>
							if an account with that email exists, we sent you an email
						</Box>
					) : (
						<Form>
							<Box mt={4} mb={4}>
								<InputField
									name='email'
									placeholder='email'
									label='Email'
									type='email'
									required
								/>
							</Box>
							<Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
								forgot password
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withApollo({ ssr: false })(ForgotPassword);
