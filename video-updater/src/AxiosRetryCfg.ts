import { attach } from 'retry-axios'
import axios from 'axios'

const interceptorId = attach()

export default axios
