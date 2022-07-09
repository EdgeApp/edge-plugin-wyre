// @flow
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { Component } from 'react'

import { EdgeButton } from './EdgeButton'

const confirmStyles = theme => ({
  title: {
    textAlign: 'center',
    color: theme.palette.primary.main,
    fontSize: '18pt'
  },
  p: {
    textAlign: 'center'
  },
  progress: {
    textAlign: 'center'
  }
})
type Props = {
  open: boolean,
  onClose(): void,
  onAccept(): void,
  classes: Object,
  message(): void,
  header: string,
  pendingMsg: string,
  rejectMsg: string,
  acceptMsg: string
}
type State = {
  loading: boolean
}

class ConfirmUnstyled extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  onAccept = () => {
    this.setState({
      loading: true
    })
    this.props.onAccept()
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle id="alert-confirm-title" disableTypography>
          <Typography component="h2" className={this.props.classes.title}>
            {this.state.loading && 'Please Wait'}
            {!this.state.loading && this.props.header}
          </Typography>
        </DialogTitle>
        {this.state.loading && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description" className={this.props.classes.p}>
              {this.props.pendingMsg}
            </DialogContentText>
            <div className={this.props.classes.progress}>
              <CircularProgress />
            </div>
          </DialogContent>
        )}
        {!this.state.loading && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description" className={this.props.classes.p}>
              {this.props.message()}
            </DialogContentText>
            <div>
              <EdgeButton color="primary" onClick={this.onAccept}>
                {this.props.acceptMsg}
              </EdgeButton>
              <EdgeButton color="default" onClick={this.props.onClose}>
                {this.props.rejectMsg}
              </EdgeButton>
            </div>
          </DialogContent>
        )}
      </Dialog>
    )
  }
}

const ConfirmDialog = withStyles(confirmStyles)(ConfirmUnstyled)

export { ConfirmDialog }
