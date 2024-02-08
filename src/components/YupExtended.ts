/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ethers } from 'ethers'
import * as yup from 'yup'
import { AnyObject, Maybe } from 'yup/lib/types'

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends yup.BaseSchema<TType, TContext, TOut> {
    isWalletAddressValid(value: string): StringSchema<TType, TContext>
  }
}

yup.addMethod<yup.StringSchema>(
  yup.string,
  'isWalletAddressValid',
  function (errorMessage) {
    return this.test(`test-card-type`, errorMessage, function (value: any) {
      const { path, createError } = this
      return (
        ethers.utils.isAddress(value) ||
        createError({ path, message: errorMessage })
      )
    })
  },
)

export default yup
