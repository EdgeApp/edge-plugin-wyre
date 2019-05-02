import fakeWallets from './fake/wallets.js'

export const ENVIRONMENT = process.env.NODE_ENV
const API_DOMAIN = ENVIRONMENT === `production` ? `sendwyre` : `testwyre`
export const API_URL = `https://api.${API_DOMAIN}.com/v3/`
export const V2_API_URL = `https://api.${API_DOMAIN}.com/v2/`
export const V3_API_URL = `https://api.${API_DOMAIN}.com/v3/`
export const API_SECRET_KEY = `a19cvrchgja82urvn47kirrlrrb7stgg`
export const KEY = `SK-XTEA2PLV-7MJX7P7A-PY296XEL-MB6DMYYL`
export const EDGE_ACCOUNT_ID = `AC-FJN8L976EW4`
export const FAKE_DEVICE_TOKEN = `THISISKYLANSTESTDEVICETOKEN314`
export const FAKE_USER_ID = `AC_XUR8VF7PAUR` // AC_XUR8VF7PAUR
export const INITIAL_WALLETS = ENVIRONMENT === 'production' ? [] : fakeWallets
export const WYRE_ENV = ENVIRONMENT === 'production' ? 'prod' : 'test'
console.log(`LOGGING env.js says environment is: ${ENVIRONMENT}`)
// core.debugLevel(0, `LOGGING env.js says environment is: ${ENVIRONMENT}`)
