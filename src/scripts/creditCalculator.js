import $ from 'jquery'
import ionRangeSlider from 'ion-rangeslider'

const creditCalculator = () => {
  const state = {
    minPortion: 0.15,
    maxPortion: 1,
    defPortion: 0.2,
    price: 0,
    payment: 0,
    period: 0,
    banks: [],

    creditParams: {
      priceParam: {
        name: 'price',
        input: document.querySelector('input[name="price"]'),
        range: $('input[name="irs-price"]'),
        min: 2700000,
        max: 6200000,
        from: 3800000,
        step: 10000
      },
      paymentParam: {
        name: 'payment',
        input: document.querySelector('input[name="payment"]'),
        range: $('input[name="irs-payment"]'),
        step: 5000
      },
      periodParam: {
        name: 'period',
        input: document.querySelector('input[name="period"]'),
        range: $('input[name="irs-period"]'),
        min: 1,
        max: 30,
        from: 7,
        step: 1
      }
    }
  }

  state.creditParams.paymentParam.min = state.creditParams.priceParam.from * state.minPortion
  state.creditParams.paymentParam.max = state.creditParams.priceParam.from * state.maxPortion
  state.creditParams.paymentParam.from = state.creditParams.priceParam.from * state.defPortion

  document.querySelectorAll('.bank-card').forEach(card =>
    state.banks.push({
      rate: parseFloat(card.querySelector('.bank-card__percent').innerHTML) / 1200,
      node: card.querySelector('.bank-card__payment')
    })
  )

  const updateBankOffers = () => {
    const amount = state.price - state.payment
    const months = state.period * 12
    state.banks.forEach(bank => {
      bank.node.innerHTML =
        Math.round((amount * bank.rate) / (1 - (1 + bank.rate) ** -months)).toLocaleString(
          'ru-RU'
        ) + ' ₽'
    })
  }

  const listen = () => {
    Object.values(state.creditParams).forEach(param => {
      param.range.ionRangeSlider({
        skin: 'round',
        hide_min_max: true,
        hide_from_to: true,
        min: param.min,
        max: param.max,
        from: param.from,
        step: param.step,
        onStart: data => {
          let from = parseInt(data.from, 10)
          state[param.name] = from
          param.input.value = from.toLocaleString('ru-RU')
        },
        onChange: data => {
          let from = parseInt(data.from, 10)
          state[param.name] = from
          param.input.value = from.toLocaleString('ru-RU')

          if (param.name === 'price') {
            let payment = Math.floor(state.price * state.defPortion)
            state.payment = payment
            state.creditParams.paymentParam.input.value = payment.toLocaleString('ru-RU')
            state.creditParams.paymentParam.range.data('ionRangeSlider').update({
              from: payment,
              min: Math.floor(state.price * state.minPortion),
              max: Math.floor(state.price * state.maxPortion)
            })
          }

          updateBankOffers()
        }
      })

      param.input.onkeypress = evt => {
        if (evt.keyCode < 48 || evt.keyCode > 57) {
          evt.preventDefault()
        }
      }

      param.input.oninput = () => {
        let value = parseInt(param.input.value.replace(/\D/g, ''), 10) || 0
        state[param.name] = value
        param.input.value = value.toLocaleString('ru-RU')
        param.range.data('ionRangeSlider').update({ from: value })

        if (param.name === 'price') {
          let payment = Math.floor(state.price * state.defPortion)
          state.payment = payment
          state.creditParams.paymentParam.input.value = payment.toLocaleString('ru-RU')
          state.creditParams.paymentParam.range.data('ionRangeSlider').update({
            from: payment,
            min: Math.floor(state.price * state.minPortion),
            max: Math.floor(state.price * state.maxPortion)
          })
        }

        updateBankOffers()
      }
    })

    updateBankOffers()
  }

  listen()
}

export default creditCalculator
