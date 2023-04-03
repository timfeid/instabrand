<script lang="ts">
  import { nextStep, checkout } from "$lib/stores/checkout";
  import Input from "../Input.svelte";
  import * as yup from 'yup';

  const set = (key: string, value: string) => {
    checkout.update(data => ({
      ...data,
      customer: {
        ...data.customer,
        [key]: value,
      }
    }))
  }

  export const test = () => {
    console.log('??')
  }

  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().matches(/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/, 'is not valid').required(),
  })

  let errors: {[index: string]: string} = {}

  const confirmForm = async () => {
    try {
      await schema.validate($checkout.customer, {abortEarly: false})
      errors = {}
      nextStep()
    } catch (e: any) {
      errors = e.inner.reduce((acc: any, err: any) => {
        return { ...acc, [err.path]: err.message };
      }, {});
    }
  }

</script>

<form on:submit|preventDefault={confirmForm}>
  <Input id="firstName" label="First Name" error={errors.firstName}>
    <input class="customer-input" type="text" value={$checkout.customer.firstName} id="firstName" on:change={(e) => set('firstName', e.currentTarget.value)}>
  </Input>

  <Input id="lastName" label="Last Name" error={errors.lastName}>
    <input class="customer-input" type="text" value={$checkout.customer.lastName} id="lastName" on:change={(e) => set('lastName', e.currentTarget.value)}>
  </Input>

  <Input id="email" label="Email" error={errors.email}>
    <input class="customer-input" type="text" value={$checkout.customer.email} id="email" on:change={(e) => set('email', e.currentTarget.value)}>
  </Input>

  <Input id="phone" label="Phone" error={errors.phone}>
    <input class="customer-input" type="text" value={$checkout.customer.phone} id="phone" on:change={(e) => set('phone', e.currentTarget.value)}>
  </Input>

  <button class="bg-brand-primary px-6 py-2 text-black rounded">Continue</button>
</form>
