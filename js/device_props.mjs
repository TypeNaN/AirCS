export default {
  type: [
    {
      name:'แอร์แบบติดผนัง', disabled: false,
      btu: [
        { name:'ไม่ทราบ', price: null },
        { name:'9,000~18,000', price: 500 },
        { name:'18,001~24,000', price: 600 },
        { name:'24,001~30,000', price: 700},
        { name:'30,001~38,000', price: 800},
      ]
    },
    {
      name:'แอร์แบบตั้งพื้น (ทรงตู้เย็น)', disabled: false,
      btu: [
        { name:'ไม่ทราบ', price: null },
        { name:'9,000~15,000', price: 500 },
        { name:'15,001~20,000', price: 600 },
        { name:'20,001~28,000', price: 700},
        { name:'28,001~38,000', price: 800},
        { name:'38,001~48,000', price: 1000 },
        { name:'44,001~58,000', price: 1200 },
        { name:'58,001~68,000', price: 1500 },
        { name:'68,001~78,000', price: 1700 },
      ]
    },
    { name:'แอร์แบบนอนพื้น', disabled: false,
      btu: [
        { name:'ไม่ทราบ', price: null },
        { name:'9,000~15,000', price: 400 },
        { name:'15,001~20,000', price: 500 },
        { name:'20,001~28,000', price: 600},
        { name:'28,001~38,000', price: 700},
        { name:'38,001~48,000', price: 800 },
        { name:'44,001~58,000', price: 1000 },
        { name:'58,001~68,000', price: 1200 },
        { name:'68,001~78,000', price: 1500 },
      ]
    },
    { name:'แอร์แบบ 4 ทิศทางฝังฝ้า', disabled: false,
      btu: [
        { name:'ไม่ทราบ', price: null },
        { name:'9,000~15,000', price: 1000 },
        { name:'15,001~20,000', price: 1300 },
        { name:'20,001~28,000', price: 1400},
        { name:'28,001~38,000', price: 1500},
        { name:'38,001~48,000', price: 1600 },
        { name:'44,001~58,000', price: 1700 },
        { name:'58,001~68,000', price: 1800 },
        { name:'68,001~78,000', price: 2000 },
      ]
    },
    { name:'แอร์แบบแขวนใต้ฝ้า (ให้บริในอนาคต)', disabled: true,
      btu: [
        { name:'ไม่ทราบ', price: null },
        { name:'9,000~13,000', price: 700 },
        { name:'13,001~16,000', price: 800 },
        { name:'16,001~28,000', price: 900},
        { name:'28,001~38,000', price: 1100},
        { name:'38,001~48,000', price: 1300 },
        { name:'44,001~58,000', price: 1600 },
        { name:'58,001~68,000', price: 2100 },
        { name:'68,001~78,000', price: 3500 },
      ]
    },
    { name:'แอร์แบบแยกส่วน/ฝังฝ้า (ให้บริในอนาคต)', disabled: true,
      btu: [
        { name:'ไม่ทราบ', price: null },
        { name:'9,000~13,000', price: 1000 },
        { name:'13,001~16,000', price: 1100 },
        { name:'16,001~28,000', price: 1200},
        { name:'28,001~38,000', price: 1300},
        { name:'38,001~48,000', price: 1400 },
        { name:'44,001~58,000', price: 1500 },
        { name:'58,001~68,000', price: 1600 },
        { name:'68,001~78,000', price: 1800 },
      ]
    },
  ],
  coolant: [
    { name:'ไม่ทราบ' },
    { name:'R22' },
    { name:'R32' },
  ],
}

