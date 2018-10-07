import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

export function configureAdapter() {
    configure({ adapter: new Adapter() })
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}