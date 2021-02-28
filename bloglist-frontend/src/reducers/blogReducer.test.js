import blogReducer from './blogReducer'
import deepFreeze from 'deep-freeze'

describe('blogReducer', () => {
  test('returns new state with action LIKE_BLOG', () => {
    const state = [
        {
          title: 'First',
          author: 'Super',
          url: 'www.moi.com',
          likes: 9,
          user: {
            username: 'superuser',
            name: 'Super User',
            id: '5f61df404524a75684c80571'
          },
          id: '5f61df674524a75684c80572'
        },
        {
          title: 'Redux 2',
          author: 'Super',
          url: 'www.redux2.com',
          likes: 9,
          user: {
            username: 'superuser',
            name: 'Super User',
            id: '5f61df404524a75684c80571'
          },
          id: '5fcfc6d7f10a062bd063dfde'
        }
    ]
    const action = {
      type: 'LIKE_BLOG',
      data: '5fcfc6d7f10a062bd063dfde'
      
    }

    deepFreeze(state)
    const newState = blogReducer(state, action)

    expect(newState).toHaveLength(2)
    expect(newState[1].likes).toBe(10)
  })
})