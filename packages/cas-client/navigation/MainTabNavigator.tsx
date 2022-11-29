import { Platform } from 'react-native'
import {
  createStackNavigator,
  NavigationStackConfig,
} from 'react-navigation-stack'
import HomeScreen from '../screens/HomeScreen'

const config: NavigationStackConfig = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
})

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
)

export default HomeStack
