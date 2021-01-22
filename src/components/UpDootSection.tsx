import gql from 'graphql-tag';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
	PostSnippetFragment,
	useVoteMutation,
	VoteMutation
} from '../generated/graphql';
import { ApolloCache } from '@apollo/client';
import { useRouter } from 'next/router';

interface UpDootSectionProps {
	post: PostSnippetFragment;
}

const updateAfterVote = (
	value: number,
	postId: number,
	cache: ApolloCache<VoteMutation>
) => {
	const data = cache.readFragment<{
		id: number;
		points: number;
		voteStatus: number | null;
	}>({
		id: 'Post:' + postId,
		fragment: gql`
			fragment _ on Post {
				id
				points
				voteStatus
			}
		`
	});
	if (data) {
		if (data.voteStatus === value) {
			return;
		}
		const newPoints =
			(data.points as number) + (!data.voteStatus ? 1 : 2) * value;
		cache.writeFragment({
			id: 'Post:' + postId,
			fragment: gql`
				fragment __ on Post {
					points
					voteStatus
				}
			`,
			data: { id: postId, points: newPoints, voteStatus: value }
		});
	}
};

export const UpDootSection: React.FC<UpDootSectionProps> = ({ post }) => {
  const router = useRouter();
	// console.log(post)
	const [loadingState, setLoadingState] = useState<
		'updoot-loading' | 'downdoot-loading' | 'not-loading'
	>('not-loading');
	const [vote] = useVoteMutation();
	return (
		<Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
			<IconButton
				colorScheme={post.voteStatus === 1 ? 'green' : undefined}
				onClick={async () => {


					if (post.voteStatus === 1) {
						return;
					}
					setLoadingState('updoot-loading');
          try{
            await vote({
              variables: {
                postId: post.id,
                value: 1
              },
              update: (cache) => updateAfterVote(1, post.id, cache)
            });
          }catch(err){
            console.log(err)
            router.push('/login');
          }
					setLoadingState('not-loading');
				}}
				isLoading={loadingState === 'updoot-loading'}
				aria-label='Up Vote'
				icon={<ChevronUpIcon />}
			/>
			{post.points}
			<IconButton
				colorScheme={post.voteStatus === -1 ? 'red' : undefined}
				onClick={async () => {
					if (post.voteStatus === -1) {
						return;
					}
					setLoadingState('downdoot-loading');
          try {
            await vote({
              variables: {
                postId: post.id,
                value: -1
              },
              update: (cache) => updateAfterVote(-1, post.id, cache)
            });

          } catch(err){
            console.log(err)
            router.push('/login');
          }
					setLoadingState('not-loading');
				}}
				isLoading={loadingState === 'downdoot-loading'}
				aria-label='Up Vote'
				icon={<ChevronDownIcon />}
			/>
		</Flex>
	);
};
