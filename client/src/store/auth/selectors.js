import { AUTH } from 'store/auth/const'

export const selectTeacherUser = () => ({
  username: 'profichain4',
  pass: 'P5KYjy9G5Sj9ZiaEoA2waeLgqsNt6gHVcv2DkRk7Nkk54ptP1TgT',
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
