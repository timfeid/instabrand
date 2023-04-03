<script lang="ts">
  import { checkout } from "$lib/stores/checkout";
  import Input from "../Input.svelte";
  import Select from 'svelte-select';
  import { states } from "$lib/stores/states";
  import * as yup from 'yup'

  const set = (key: string, value: string) => {
    checkout.update(data => ({
      ...data,
      address: {
        ...data.address,
        [key]: value,
      }
    }))
  }

  const schema = yup.object().shape({
    line1: yup.string().required(),
    line2: yup.string().nullable(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
  })

  let errors: {[index: string]: string} = {}

  export const validate = async () => {
    try {
      await schema.validate($checkout.address, {abortEarly: false})
      errors = {}
      return true
    } catch (e: any) {
      if (e instanceof yup.ValidationError) {
        errors = e.inner.reduce((acc: any, err: any) => {
          return { ...acc, [err.path]: err.message };
        }, {});
      }
    }

    return false
  }

  const handleStateChange = (e: any) => {
    set('state', e.detail.abbreviation)

    validate()
  }

  const itemFilter = (label: string, filterText: string, option: {name: string, abbreviation: string}) => {
    if ([label.toLowerCase(), option.abbreviation.toLowerCase()].includes(filterText.toLowerCase())) {
      if ($checkout.address.state !== option.abbreviation) {
        set('state', option.abbreviation)
      }
    }

    return label.toLowerCase().includes(filterText.toLowerCase()) || option.abbreviation.toLowerCase().includes(filterText.toLowerCase())
  }

</script>
<Input error={errors.line1} id="line1" label="Address">
  <input type="text" value={$checkout.address.line1} id="line1" on:change={(e) => set('line1', e.currentTarget.value)}>
</Input>

<Input error={errors.line2} id="line2" label="Apartment">
  <input type="text" value={$checkout.address.line2} id="line2" on:change={(e) => set('line2', e.currentTarget.value)}>
</Input>

<Input error={errors.city} id="city" label="City">
  <input type="text" value={$checkout.address.city} id="city" on:change={(e) => set('city', e.currentTarget.value)}>
</Input>

<Input error={errors.state} id="state" label="State">
  <Select id="state" clearable={false} itemFilter={itemFilter} items={$states} itemId="abbreviation" label="name" value={$checkout.address.state} on:select={handleStateChange} />
</Input>

<Input error={errors.zip} id="zip" label="Postal code">
  <input type="text" value={$checkout.address.zip} id="zip" on:change={(e) => set('zip', e.currentTarget.value)}>
</Input>

