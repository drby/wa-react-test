import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import faker from 'faker'
import { nanoid } from 'nanoid'

import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST } from 'Router/routes'

import { Column, Container, Post, PostAuthor, PostBody } from './styles'

import ExpensiveTree from '../ExpensiveTree'

function Root() {
  const [count, setCount] = useState(0)
  const [fields, setFields] = useState([
    {
      name: faker.name.findName(),
      id: nanoid(),
    },
  ])

  const [value, setValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(5)
  const { data, loading } = useQuery(postsQuery, {
    variables: {
      page: currentPage,
      limit: postsPerPage,
    },
  })

  function handlePush() {
    setFields([{ name: faker.name.findName(), id: nanoid() }, ...fields])
  }

  function handleAlertClick() {
    // Save the current count in a local variable
    const savedCount = count
    setTimeout(() => {
      alert(`You clicked ${savedCount} times`)
    }, 2500)
  }

  const posts = data?.posts.data || []
  const totalCount = data?.posts.meta?.totalCount || 0
  const totalPages = Math.ceil(totalCount / postsPerPage)

  return (
    <Container>
      <Column>
        <h4>Posts with Pagination</h4>
        {loading
          ? 'Loading...'
          : posts.map(post => (
              <Post mx={4}>
                <NavLink href={POST(post.id)} to={POST(post.id)}>
                  {post.title}
                </NavLink>
                <PostAuthor>by {post.user.name}</PostAuthor>
                <PostBody>{post.body}</PostBody>
              </Post>
            ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
          }}
        >
          <button
            disabled={currentPage === 1}
            style={{ margin: '0 5px', padding: '5px 10px' }}
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span style={{ margin: '0 10px', lineHeight: '30px' }}>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            style={{ margin: '0 5px', padding: '5px 10px' }}
            type="button"
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages))
            }}
          >
            Next
          </button>
        </div>
      </Column>
      <Column>
        <h4>Slow rendering [fixed]</h4>
        <label>
          Enter something here:
          <br />
          <input
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
        </label>
        <p>Much fast...</p>
        <ExpensiveTree />

        <h4>Closures?</h4>
        <p>You clicked {count} times</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <button type="button" onClick={handleAlertClick}>
          Show alert
        </button>
      </Column>

      <Column>
        <h4>Incorrect form field behavior</h4>
        <button type="button" onClick={handlePush}>
          Add more
        </button>
        <ol>
          {fields.map((field, index) => (
            <li key={index}>
              {field.name}:<br />
              <input type="text" />
            </li>
          ))}
        </ol>
      </Column>
    </Container>
  )
}

export default Root
