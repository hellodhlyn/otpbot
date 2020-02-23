# otpbot

> Time-based OTP generator via [Keybase](https://keybase.io)

## Usage

Just say hello to [otpbot](https://keybase.io/otpbot) on Keybase!

### Commands

```text
### Add a new OTP account. 
add <name> <secret>

### List all OTP accounts.
list
ls

### Generate OTP.
generate <name>
gen      <name>

### Remove the OTP account.
remove <name>
rm     <name>
```

## Development
### Prerequisites
* NodeJS 12.X or later
* yarn

### Setup
```sh
# Install requirements
yarn
```

### Test
```sh
# Run lint
yarn lint

# Run unit tests
yarn test
```

### Run
```sh
yarn debug
```

## Deployment
```bash
# Run using native nodejs
yarn build
yarn start

# Run using docker
docker build -t <name> .
docker run <name>
```
