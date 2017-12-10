import { AUTH } from 'store/auth/const'

export const selectTeacherUser = () => ({
  username: 'profichain3',
  pass: 'P5HvkckrN4WPp5En8LssgVkvsTJsQFLs2onsXXhkx1t1u4c2fg29',
  role: 'teacher',
})

export const selectStudent = () => ({
  username: 'profichain2',
  pass: 'P5K22HBBg2y2UcJyvb6CSHwHXsPW22QyaoFweAp5K78as3DjW2eZ',
  role: 'student',
})

export const selectUsers = () => [
  selectTeacherUser(),
  selectStudent(),
]


export const selectUserByUserName = (state, username) => selectUsers().find(u => u.username === username)

export const selectCurrentUser = (state) => state[AUTH].currentUser

export const selectCurrentUserRole = (state) => (state[AUTH].currentUser || {}).role
