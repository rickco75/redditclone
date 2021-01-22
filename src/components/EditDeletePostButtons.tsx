import React from 'react'
import NextLink from 'next/link'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  id: number,
  creatorId: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({id, creatorId}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();
  
    if (meData?.me?.id !== creatorId){
      return null
    }
    return (
      <Box>
      <NextLink
        href='/post/edit/[id]'
        as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          ml='auto'
          aria-label='Edit Post'
          icon={<EditIcon />}
        />
      </NextLink>
      <IconButton
        ml='auto'
        aria-label='Delete Post'
        colorScheme='red'
        icon={<DeleteIcon />}
        onClick={() => {
          deletePost({ variables: {id}, update: (cache)=> {
            cache.evict({id: 'Post:' + id})
          } });
        }}
      />
    </Box>
    );
}