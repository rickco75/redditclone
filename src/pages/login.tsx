import React from 'react';
import { Formik, Form } from 'formik';
import { InputField } from '../components/InputField';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Layout } from '../components/Layout';
import { withApollo } from '../utils/withApollo';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
	const router = useRouter();
	const [login] = useLoginMutation();

	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ usernameOrEmail: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login({
						variables: values,
						update: (cache, { data }) => {
							cache.writeQuery<MeQuery>({
								query: MeDocument,
								data: {
									__typename: 'Query',
									me: data?.login.user
								}
							});
							cache.evict({ fieldName: 'posts:{}' });
						}
					});
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						if (typeof router.query.next === 'string') {
							router.push(router.query.next);
						} else {
							router.push('/');
						}
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='usernameOrEmail'
							placeholder='username or email'
							label='Username or Email'
						/>
						<Box mt={4} mb={4}>
							<InputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							/>
						</Box>
						<Flex>
							<NextLink href='/forgot-password'>
								<Link color='teal.500' ml='auto' mt={2}>
									forgot password?
								</Link>
							</NextLink>
						</Flex>
						<Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withApollo({ ssr: false })(Login);
