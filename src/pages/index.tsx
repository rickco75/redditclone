import {
	Box,
	Button,
	Flex,
	Heading,
	Link,
	Stack,
	Text
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { EditDeletePostButtons } from '../components/EditDeletePostButtons';
import { Layout } from '../components/Layout';
import { UpDootSection } from '../components/UpDootSection';
import { usePostsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const Index = () => {
	const { data, error, loading, fetchMore, variables } = usePostsQuery({
		variables: {
			limit: 5,
			cursor: null
		},
		notifyOnNetworkStatusChange: true
	});

	// console.log(variables)
	if (!loading && !data) {
		return (
			<div>
				<div>There were problems loading your data!</div>
				<div>{error?.message}</div>
			</div>
		);
	}
	return (
		<Layout>
			{!data && loading ? (
				<div>loading posts</div>
			) : (
				<Stack spacing={8}>
					{data!.posts.posts.map((p) =>
						!p ? null : (
							<Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
								<UpDootSection post={p} />
								<Box flex={1}>
									<NextLink href='/post/[id]' as={`/post/${p.id}`}>
										<Link>
											<Heading fontSize='xl'>{p.title}</Heading>
										</Link>
									</NextLink>
									<Text>posted by {p.creator.username}</Text>
									<Flex align='center'>
										<Text flex={1} mt={4}>
											{p.textSnippet}
										</Text>
										<Box ml='auto'>
											<EditDeletePostButtons
												creatorId={p.creatorId}
												id={p.id}
											/>
										</Box>
									</Flex>
								</Box>
							</Flex>
						)
					)}
				</Stack>
			)}
			{data && data.posts.hasMore && (
				<Flex>
					<Button
						isLoading={loading}
						onClick={() => {
							fetchMore({
								variables: {
									limit: variables!.limit,
									cursor:
										data.posts.posts[data.posts.posts.length - 1].createdAt
								}
							});
						}}
            margin='auto'
            m="auto"
						my={8}>
						Load more
					</Button>
				</Flex>
			)}
		</Layout>
	);
};

export default withApollo({ ssr: true })(Index);
