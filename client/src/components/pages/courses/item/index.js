import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-md/lib/Buttons/Button'
import Card from 'react-md/lib/Cards/Card'
import CardTitle from 'react-md/lib/Cards/CardTitle'
import CardText from 'react-md/lib/Cards/CardText'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import golos from 'golos-js'
import CryptoJS from 'crypto-js'

import { isBrowser } from 'config'
import { selectUser, selectStudent } from 'store/selectors'
import { PageTemplate, AnswerForm, OneSelectWidget } from 'components'


if (isBrowser) {
  require('./styles.scss')
  window.golos = golos
  window.CryptoJS = CryptoJS
}

@connect(
  state => ({
    user: selectUser(state),
    student: selectStudent(state),
  })
)
class CoursesItemPage extends PureComponent {
  static propTypes = {}

  static defaultProps = {
    //courses: [],
  }

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

  fetchPost() {
    const url = this.props.location.pathname.slice(7)
    golos.api.getState(url, (err, result) => {
      golos.api.getAccounts([this.props.user.username], (getAccountsErr, getAccountsResults) => {
        const memoKey = getAccountsResults[0].memo_key

        console.log('getState', err, result)
        if (result && result.content) {
          this.setState((prevState) => {
            const content = Object.values(result.content).filter(c => c.url === url)[0] || Object.values(result.content)[0]
            let replies = []
            const post = {
              title: content.title,
              created: content.created,
              body: content.body,
              permlink: content.permlink,
            }
            if (content.replies && content.replies.length > 0) {
              replies = content.replies.map(r => {
                const content = result.content[r]

                const reply = {
                  id: content.id,
                  title: content.title,
                  created: content.created,
                  body: content.body,
                  encrypted: true,
                  permlink: content.permlink,
                }

                if (content.replies && content.replies.length > 0) {
                  reply.replies = content.replies.map(r => {
                    const content = result.content[r]

                    return {
                      id: content.id,
                      title: content.title,
                      created: content.created,
                      body: content.body,
                      encrypted: true,
                      permlink: content.permlink,
                    }
                  })
                }

                return reply
              })
            }
            return {
              ...prevState,
              post,
              replies,
              memoKey,
            }
          })
        }
      })
    })
  }

  componentWillMount() {
    this.fetchPost()
  }

  onAnswerSubmit(data) {
    const msgData = [
      this.props.student.username,
      data.formData.answer,
    ]
    const encryptedMessage = CryptoJS.AES.encrypt(msgData.join(':'), this.state.memoKey).toString()

    console.log('encryptedMessage: ', encryptedMessage)
    const postingWif = golos.auth.toWif(this.props.student.username, this.props.student.pass, 'posting');

    const parentAuthor = this.props.user.username
    const author = this.props.student.username
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
        console.log(replies)
        return Object.assign({}, prevState, {
          replies,
        })
      })
    }
  }

  voteAnswer(ind) {
    return () => {
      const reply = this.state.replies[ind]
      console.log(reply.mark)
      const postingWif = golos.auth.toWif(this.props.user.username, this.props.user.pass, 'posting');

      //golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {

      golos.broadcast.comment(
        postingWif,
        this.props.student.username,
        reply.permlink,
        this.props.user.username,
        `${reply.permlink}-teacher-${new Date().getTime()}`,
        '',
        `Оценка ${reply.mark}`,
        {},
        (err, result) => {
          console.log(err, result);
          if (!err) {
            this.fetchPost()
          }
        });


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
    console.log('render: ', this.state)
    return (
      <PageTemplate
        title={`Курс: ${this.state.post.title}`}
      >

        <Card>
          {/*<CardTitle*/}
          {/*title={`Курс: ${this.state.post.title}`}*/}
          {/*/>*/}
          <CardText>
            <p>
              {this.state.post.body}
            </p>
            <div>
              {this.state.post.created}
            </div>

          </CardText>
        </Card>

        <div
          className="course-item__answer-form"
        >

          <Card
            className="course-item-reply"
          >
            <CardTitle
              title="Добавить ответ"
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
                  Опубликовать
                </Button>
              </AnswerForm>
            </CardText>
          </Card>
        </div>
        {this.state.replies.length > 0 && (
          <div
            className="course-item__replies"
          >

            <h3>Ответы</h3>

            {this.state.replies.map((r, ind) => (
              <Card
                key={r.id}
                className="course-item-reply"
              >
                <CardTitle
                  title={r.title}
                />
                <CardText>
                  <p>
                    {r.body}
                  </p>


                  <p>{r.created}</p>

                  <div
                    className="course-item-reply__btns"
                  >
                    <Button
                      raised
                      onClick={this.decrypt(ind)}
                    >
                      Расшифровать
                    </Button>

                    <div

                    >
                      <OneSelectWidget
                        placeholder="Оценка"
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
                        Оценить
                      </Button>
                    </div>

                  </div>

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
