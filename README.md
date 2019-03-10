# FeliCa driver for WebUSB
## What is this?
FeliCa driver for WebUSB with RC-S380.

## How to install

```bash
$ npm i felica_driver
# or
$ yarn add felica_driver
```

## How to use

```TypeScript
import { TypeFTag } from 'felica_driver'

async fetchFeliCaIDm() {
    // Connect RC-S380
    const type_f_tag = await TypeFTag.connect()

    // find IDm
    const idm = await type_f_tag.findIDm()
    return idm.reduce((memo, i) => {
        return memo + ('0' + i.toString(16)).slice(-2)
    }, '')
}
```

## Functions
- find IDm

## Loadmaps
- read unencrypted data

## License
MIT
