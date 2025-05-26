import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'

import { useQuery } from '@apollo/client'
import arrayMove from 'array-move'

import postQuery from 'GraphQL/Queries/post.graphql'
import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST, ROOT } from 'Router/routes'

import {
  Back,
  Column,
  Container,
  PostAuthor,
  PostBody,
  PostComment,
  PostContainer,
} from './styles'

const SortableContainer = sortableContainer(({ children }) => (
  <div>{children}</div>
))

const SortableItem = sortableElement(({ value }) => (
  <PostComment mb={2}>{value}</PostComment>
))

function Post() {
  const [comments, setComments] = useState([])
  const history = useHistory()
  const {
    params: { postId },
  } = useRouteMatch()

  const handleClick = () => history.push(ROOT)

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setComments(arrayMove(comments, oldIndex, newIndex))
  }

  const { data, loading } = useQuery(postQuery, { variables: { id: postId } })
  const { data: postsData } = useQuery(postsQuery)

  const post = data?.post || {}
  const allPosts = postsData?.posts?.data || []

  // Find current post index in the array of all posts
  const currentPostIndex = allPosts.findIndex(p => p.id === postId)

  // Determine previous and next post IDs
  const prevPostId =
    currentPostIndex > 0 ? allPosts[currentPostIndex - 1]?.id : null
  const nextPostId =
    currentPostIndex < allPosts.length - 1
      ? allPosts[currentPostIndex + 1]?.id
      : null

  const handlePrevClick = () => {
    if (prevPostId) {
      history.push(POST(prevPostId))
    }
  }

  const handleNextClick = () => {
    if (nextPostId) {
      history.push(POST(nextPostId))
    }
  }

  useEffect(() => {
    setComments(post.comments?.data || [])
  }, [post])

  return (
    <Container>
      <Column>
        <Back onClick={handleClick}>Back</Back>
      </Column>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <Column>
            <h4>Post Navigation</h4>
            <PostContainer key={post.id}>
              <h3>{post.title}</h3>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody mt={2}>{post.body}</PostBody>
            </PostContainer>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '20px 0',
              }}
            >
              <button
                disabled={!prevPostId}
                style={{ margin: '0 5px', padding: '5px 10px' }}
                type="button"
                onClick={handlePrevClick}
              >
                Previous
              </button>
              <span style={{ margin: '0 10px', lineHeight: '30px' }}>
                Post {currentPostIndex + 1} of {allPosts.length || 1}
              </span>
              <button
                disabled={!nextPostId}
                style={{ margin: '0 5px', padding: '5px 10px' }}
                type="button"
                onClick={handleNextClick}
              >
                Next
              </button>
            </div>
          </Column>

          <Column>
            <h4>Correct sorting</h4>
            Comments:
            <SortableContainer onSortEnd={handleSortEnd}>
              {comments.map((comment, index) => (
                <SortableItem
                  index={index}
                  key={comment.id}
                  mb={3}
                  value={comment.body}
                />
              ))}
            </SortableContainer>
          </Column>
        </>
      )}
    </Container>
  )
}

export default Post
