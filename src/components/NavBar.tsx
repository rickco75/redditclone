import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
// import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  // const router = useRouter();
  const  [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
	const { data, loading } = useMeQuery({
		skip: isServer()
	});


	let body = null;

	// data is loading
	if (loading) {
		// user not logged in
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href='/login'>
					<Link color='white' mr={2}>
						Login
					</Link>
				</NextLink>
				<NextLink href='/register'>
					<Link color='white' mr={2}>
						Register
					</Link>
				</NextLink>
			</>
		);
		// user is logged in
	} else {
		body = (
			<Flex align='center'>
				<NextLink href='/create-post'>
					<Button size="sm" as={Link} mr={4}>
						create post
					</Button>
				</NextLink>
				<Box mr={2}>{data.me.username}</Box>
				<Button
					variant='link'
					onClick={async () => {
            await logout();
            await apolloClient.resetStore();
					}}
					isLoading={logoutFetching}>
					Logout
				</Button>
			</Flex>
		);
	}

	return (
		<Flex zIndex={1} position='sticky' top={0} bg='tan' p={4} align='center'>
			<Flex align="center" flex={1} margin="auto" maxW={800}>
				<NextLink href='/'>
					<Link>
						<Heading>ReEddit</Heading>
					</Link>
				</NextLink>
				<Box ml={'auto'}>{body}</Box>
			</Flex>
		</Flex>
	);
};
