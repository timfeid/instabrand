<script lang="ts">
  import Payment from '$lib/components/checkout/Payment.svelte';
  import Review from '$lib/components/checkout/Review.svelte';
  import YourInformation from '$lib/components/checkout/YourInformation.svelte';
  import YourInformationClosed from '$lib/components/checkout/YourInformationClosed.svelte';
  import Stepper from '$lib/components/Stepper.svelte';
	import { checkout } from '../../stores/checkout';
	import Shipping from './Shipping.svelte';
	import ShippingClosed from './ShippingClosed.svelte';

    export let data: any;

    if (data.user) {
      checkout.update(co => ({
        ...co,
        address: {
          ...co.address,
          ...data.user.customer?.address,
          state: data.user.customer?.address?.state?.abbreviation || '',
        },
        customer: {
          ...co.customer,
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          phone: data.user.customer?.phone || '',
        }
      }))
    }

    const steps = [
      {
        titleComponent: 'Your Information',
        bodyComponent: YourInformation,
        closedComponent: YourInformationClosed,
        isComplete: false,
        isOpen: true,
      },
      {
        titleComponent: 'Shipping',
        bodyComponent: Shipping,
        closedComponent: ShippingClosed,
        isComplete: false,
        isOpen: false,
      },
      {
        titleComponent: 'Payment',
        bodyComponent: Payment,
        isComplete: false,
        isOpen: false,
      },
      {
        titleComponent: 'Review',
        bodyComponent: Review,
        isComplete: false,
        isOpen: true,
      },
    ]

    checkout.subscribe(data => {
      for (let i = 0; i < data.currentStep; i++) {
        steps[i].isComplete = true
        steps[i].isOpen = false
      }
      steps[data.currentStep].isOpen = true
    })

  </script>

  <Stepper {steps}></Stepper>
