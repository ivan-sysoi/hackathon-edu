import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-md/lib/Buttons/Button'
import Card from 'react-md/lib/Cards/Card'
import CardTitle from 'react-md/lib/Cards/CardTitle'
import CardText from 'react-md/lib/Cards/CardText'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import CryptoJS from 'crypto-js'

import golos from 'services/golos'
import { isBrowser } from 'config'
import { selectCurrentUser } from 'store/selectors'
import { resetFormData, addSuccessToast } from 'store/actions'
import { PageTemplate, AnswerForm, OneSelectWidget } from 'components'


if (isBrowser) {
  require('./styles.scss')
  window.golos = golos
  window.CryptoJS = CryptoJS
}

@connect(
  state => ({
    user: selectCurrentUser(state),
  }),
  dispatch => ({
    resetAnswerForm: () => dispatch(resetFormData(AnswerForm.formName)),
    addVoteNotification: () => dispatch(addSuccessToast('Your vote has been added!')),
  })
)
class CoursesItemPage extends PureComponent {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    //console.log(this.props)
    this.state = {
      post: {
        title: '',
        created: '',
        body: '',
      },
      replies: [],
    }
    this.onAnswerSubmit = this.onAnswerSubmit.bind(this)
    this.decrypt = this.decrypt.bind(this)
    this.voteAnswer = this.voteAnswer.bind(this)
    this.onMarkChange = this.onMarkChange.bind(this)
  }

  postContentData(content) {
    return {
      id: content.id,
      title: content.title,
      body: content.body,
      created: content.created,
      permlink: content.permlink,
      author: content.author,
    }
  }

  fetchPost() {
    if (isBrowser) {
      const url = this.props.location.pathname.slice(7)
      golos.api.getState(url, (err, result) => {
        const postContent = Object.values(result.content).filter(c => c.url === url)[0]

        golos.api.getAccounts([postContent.author], (getAccountsErr, getAccountsResults) => {
          console.log('getState', err, result)
          if (result && result.content) {
            this.setState((prevState) => {
              let replies = []

              if (postContent.replies && postContent.replies.length > 0) {
                replies = postContent.replies.map(r => {
                  const replyContent = result.content[r]

                  const isVotedByTeacher = this.props.user.role === 'teacher' && replyContent.active_votes
                    .findIndex(v => v.voter === this.props.user.username) !== -1

                  const reply = Object.assign(
                    {},
                    this.postContentData(replyContent),
                    { encrypted: true, replies: [], isVotedByTeacher }
                  )

                  if (replyContent.replies && replyContent.replies.length > 0) {
                    reply.replies = replyContent.replies.map(r => {
                      const answerContent = result.content[r]
                      return this.postContentData(answerContent)
                    })
                  }
                  return reply
                })
              }
              return {
                ...prevState,
                post: this.postContentData(postContent),
                replies,
                memoKey: getAccountsResults[0].memo_key,
              }
            })
          }
        })
      })
    }
  }

  componentWillMount() {
    this.fetchPost()
    this.props.resetAnswerForm()
  }

  onAnswerSubmit(data) {
    const msgData = [
      this.props.user.username,
      data.formData.answer,
    ]
    const encryptedMessage = CryptoJS.AES.encrypt(msgData.join(':'), this.state.memoKey).toString()

    const postingWif = golos.auth.toWif(this.props.user.username, this.props.user.pass, 'posting');

    const parentAuthor = this.state.post.author
    const author = this.props.user.username
    const parentPermlink = this.state.post.permlink
//golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
    golos.broadcast.comment(
      postingWif,
      parentAuthor,
      parentPermlink,
      author,
      `${this.state.post.permlink}-answer-${new Date().getTime()}`,
      '',
      encryptedMessage,
      {},
      (err, result) => {
        console.log(err, result);
        if (!err) {
          this.fetchPost()
        }
      });

  }

  decrypt(ind) {
    return () => {
      this.setState((prevState) => {
        const replies = [...prevState.replies]
        replies[ind].encrypted = false
        try {
          replies[ind].body = CryptoJS.AES.decrypt(replies[ind].body, prevState.memoKey).toString(CryptoJS.enc.Utf8)
        } catch (e) {
          replies[ind].body = 'Invalid encrypted message'
        }
        //console.log(replies)
        return Object.assign({}, prevState, {
          replies,
        })
      })
    }
  }

  voteAnswer(ind) {
    return () => {
      const reply = this.state.replies[ind]
      const postingWif = golos.auth.toWif(this.props.user.username, this.props.user.pass, 'posting')
      //golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
      //golos.broadcast.comment(
      //  postingWif,
      //  reply.author,
      //  reply.permlink,
      //  this.props.user.username,
      //  `${reply.permlink}-teacher-${new Date().getTime()}`,
      //  '',
      //  `Оценка ${reply.mark}`,
      //  {},
      //  (err, result) => {
      //    console.log(err, result);
      //    if (!err) {
      //      this.fetchPost()
      //    }
      //  })

      golos.broadcast.vote(
        postingWif,
        this.props.user.username,
        reply.author,
        reply.permlink,
        10000 * reply.mark / 5,
        (err, results) => {
          if (!err) {
            this.props.addVoteNotification()
            this.fetchPost()
          }
          console.log('Vote for reply', err, results)
        }
      )

    }
  }

  onMarkChange(ind) {
    return (value) => {
      this.setState((prevState) => {
        const replies = [...prevState.replies]
        replies[ind].mark = value
        return Object.assign({}, prevState, {
          replies,
        })
      })
    }
  }

  render() {
    //console.log('Item page render: ', this.props)
    //console.log('Item page render: ', this.state)
    return (
      <PageTemplate
        title={`Course: ${this.state.post.title}`}
      >

        <Card
          className="course-card"
        >
          {/*<CardTitle*/}
          {/*title={`Курс: ${this.state.post.title}`}*/}
          {/*/>*/}
          <CardText>
            <p
              className="course-card__body"
            >
              {this.state.post.body.split('\n').map(l => (
                <p>{l}</p>
              ))}
            </p>
            <div>
              {this.state.post.created}
            </div>

          </CardText>
        </Card>

        {this.props.user.role === 'student' && (
          <div
            className="course-item__answer-form"
          >
            <Card
              className="course-item-reply"
            >
              <CardTitle
                title="Reply"
              />
              <CardText>
                <AnswerForm
                  onSubmit={this.onAnswerSubmit}
                >
                  <Button
                    raised
                    primary
                    type="submit"
                  >
                    Submit
                  </Button>
                </AnswerForm>
              </CardText>
            </Card>
          </div>
        )}


        {this.state.replies.length > 0 && (
          <div
            className="course-item__replies"
          >

            <h3>Answers</h3>

            {this.state.replies.map((r, ind) => (
              <Card
                key={r.id}
                className="course-item-reply"
              >
                <CardText>
                  <p>
                    {r.body}
                  </p>
                  <p>{r.created}</p>

                  {this.props.user.role === 'teacher' && (
                    <div
                      className="course-item-reply__btns"
                    >
                      {r.encrypted && (
                        <Button
                          raised
                          onClick={this.decrypt(ind)}
                        >
                          Decode
                        </Button>
                      )}

                      {!r.isVotedByTeacher && (
                        <div

                        >
                          <OneSelectWidget
                            placeholder="Mark"
                            style={{ width: 50 }}
                            value={r.mark}
                            options={{
                              _fullWidth: false,
                              enumOptions: [
                                { value: 1, label: '1' },
                                { value: 2, label: '2' },
                                { value: 3, label: '3' },
                                { value: 4, label: '4' },
                                { value: 5, label: '5' },
                              ]
                            }}
                            onChange={this.onMarkChange(ind)}
                          />
                          <Button
                            raised
                            primary
                            onClick={this.voteAnswer(ind)}
                          >
                            Vote
                          </Button>
                        </div>
                      )}
                    </div>
                  )}


                  <ul>
                    {r.replies && r.replies.map(r => (
                      <li>
                        {r.body}
                      </li>
                    ))}
                  </ul>
                </CardText>
              </Card>
            ))}

          </div>
        )}


      </PageTemplate>
    )
  }
}

export default CoursesItemPage
