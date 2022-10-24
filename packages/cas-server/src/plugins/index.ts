export const LoggerPlugin = {}

export const ErrorResponsePlugin = {
  async requestDidStart() {
    console.log('Request started!')
  },
}
