# sms

## Prerequisites

Depending on which specific SMS vendor is used, some or all of the following operations should be done.

- Add server IP address to SMS vendor(s)' IP white list.
- Add message template on vendor(s)' control panel.
- Create a .env file under repository root directory, and specify neccesary tokens (or passwords, appIds, etc.) in it.

## Bootstrap

```shell
cp .env_template .env
pnpm install
pnpm start
```
