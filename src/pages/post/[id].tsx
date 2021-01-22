import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
	const { data, loading } = useGetPostFromUrl();

	if (loading) {
		return (
			<Layout>
				<div>loading...</div>
			</Layout>
		);
	}

	if (!data?.post) {
		return (
			<Layout>
				<Box>Could not locate post</Box>
			</Layout>
		);
	}
	return (
		<Layout>
			<Heading mb={4}>{data.post.title}</Heading>
			{data.post.text}
			<Box mt={4}>
				<EditDeletePostButtons
					id={data.post.id}
					creatorId={data.post.creatorId}
				/>
			</Box>
		</Layout>
	);
};

export default withApollo({ ssr: true })( Post );
