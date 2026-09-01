/**
 * @licstart  The following is the entire license notice for the
 * JavaScript code in this page.
 *
 * Flex - Calculadora Flex
 * Copyright (C) 2019  Sepbit
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 */
const app = {
  init: function () {
    window.addEventListener('hashchange', this.router)
    window.addEventListener('load', this.router)
    this.toggler()
    this.form()
  },

  router: function () {
    const home = document.getElementById('home')
    const about = document.getElementById('about')

    if (window.location.hash === '#/about') {
      home.style.display = 'none'
      about.style.display = ''
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    } else {
      home.style.display = ''
      about.style.display = 'none'
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  },

  toggler: function () {
    if (window.innerWidth < 992) {
      document.querySelectorAll('.navbar-nav a').forEach(function (link) {
        link.addEventListener('click', function () {
          document.querySelector('.navbar-toggler').click()
        })
      })
    }
  },

  // Calcula o limite de preço (razão etanol/gasolina) a partir do qual o
  // etanol compensa, considerando o percentual de etanol anidro na gasolina.
  ethanolLimit: function (percent) {
    if (isNaN(percent)) percent = 32
    percent = Math.min(100, Math.max(0, percent))
    // Eficiência da gasolina pura em relação ao etanol puro (etanol = 1).
    // O limite clássico de 0,70 equivale a 1 / 0,70.
    const gasolineEfficiency = 1 / 0.7
    // Eficiência da mistura: a fração de etanol tem eficiência 1 e a fração
    // restante de gasolina pura tem eficiência gasolineEfficiency.
    const blendEfficiency =
      percent / 100 + ((100 - percent) / 100) * gasolineEfficiency
    return 1 / blendEfficiency
  },

  form: function () {
    const calculator = document.getElementById('calculator')
    calculator.addEventListener('submit', function (e) {
      e.preventDefault()

      bootstrap.Modal.getOrCreateInstance(
        document.getElementById('loading')
      ).toggle()

      const result = document.getElementById('resultMsg')
      const ethanol = document.getElementById('ethanol').value
      const gasoline = document.getElementById('gasoline').value
      const ethanolPercent = Number(
        document.getElementById('ethanolPercent').value
      )
      const division = Number(ethanol) / Number(gasoline)
      const limit = app.ethanolLimit(ethanolPercent)

      setTimeout(function () {
        if (division <= limit) {
          result.innerHTML = '<p>É mais vantajoso abastecer com</p>' +
            '<h1 class="text-primary">Etanol</h1>'
        } else {
          result.innerHTML = '<p>É mais vantajoso abastecer com</p>' +
            '<h1 class="text-primary">Gasolina</h1>'
        }

        bootstrap.Modal.getOrCreateInstance(
          document.getElementById('loading')
        ).toggle()
        bootstrap.Modal.getOrCreateInstance(
          document.getElementById('resultModal')
        ).toggle()
      }, 1000)
    })
  }
}

app.init()
