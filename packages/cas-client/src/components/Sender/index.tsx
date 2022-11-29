import React from 'react'
import { Button } from '@ui-kitten/components'
import styled from 'styled-components/native'
import { BASE_PERIOD, Scheduler } from '../../common/utils'

const SMS_DURATION = 60

export interface SenderProps {
  text: string
  onSend: Function
  duration?: number
  disabled?: boolean
}

const SenderButton = styled(Button)`
  padding-horizontal: 0;
  padding-vertical: 0;
`

export default function Sender(props: SenderProps) {
  const { text, onSend, duration = SMS_DURATION, disabled } = props
  const [loading, setLoading] = React.useState(false)
  const [countdown, setCountdown] = React.useState(duration)
  React.useLayoutEffect(() => {
    setCountdown(duration)
  }, [duration])
  const onPress = React.useCallback(() => {
    if (loading || disabled) {
      return
    }
    const sendAction = async () => {
      try {
        await onSend()
        setLoading(true)
        Scheduler.spawnTasks(
          new Scheduler.Task({
            totalPeriod: (duration * 1000) / BASE_PERIOD,
            onComplete() {
              setLoading(false)
              setCountdown(duration)
            },
            intervalPeriod: 1000 / BASE_PERIOD,
            intervalCallback(experiencedPeriod) {
              setCountdown(60 - experiencedPeriod / 1000)
            },
          })
        )
      } catch (e) {
        setLoading(false)
        console.warn('Failed to execute send action,caused by:', e)
      }
    }
    sendAction()
  }, [loading, duration, onSend, disabled])
  return (
    <SenderButton
      disabled={disabled}
      size={'tiny'}
      onPress={onPress}
      appearance="ghost"
    >
      {loading ? `${countdown}s` : text}
    </SenderButton>
  )
}
