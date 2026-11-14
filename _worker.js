const SHIPDAY_API_URL = 'https://api.shipday.com';
const FALLBACK_CARRIER_ID = 554212;

const ADMIN_USER = 'superadmin';
const CASHIER_USER = 'cajero';
const DEFAULT_CASHIER_PASS = 'Mucadele2026Caja';
const COOKIE_NAME = 'mucadele_session';

function isAdminUser(user) {
  if (!user) return false;
  if (typeof user === 'string') return user !== 'cajero' && user !== CASHIER_USER;
  return user.role === 'admin' || user.username === 'superadmin';
}

function isCashierUser(user) {
  if (!user) return false;
  if (typeof user === 'string') return user === 'cajero' || user === CASHIER_USER;
  return user.role === 'cajero' || user.username === 'cajero';
}

const STORE_CONFIG = {
  name: 'mucadele licores',
  address: 'Calle 11 # 24-36, Comuna 3, Santa Marta, Magdalena, Colombia',
  phoneNumber: '+573015153867',
  latitude: 11.24383,
  longitude: -74.186437,
};

const DEFAULT_CATALOG = [
  {
    "id": "old-parr-750ml-127",
    "name": "OLD PARR 750ML",
    "presentation": "750 ml",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148671-descarga+%2828%29.jpg?Expires=1795286777&Signature=o7VvMp5yzbSSP~ezCSmGav2~j~wW8WMM1z9CenVeJxv2w43R3eUl4n0caVsFiJU6UAeeyjUo2SAWM2-T0ee-jvcZL~fKHPzoJkk1KWtZHAS451QsLYjpHNEGpDVOMnNoFLSXPGXsYGIYNeJsI0Yl7x2eNnYf413PR4mqCAF6dZbnJ08Z36qqobHsOFbWUlZFeGdlME1VkywUFlmImxsdpTyZimTPMrR2Ybchiiz8bbIGkO1C-FP-5TGDvn7Td0El3QWyERS1xDRp3YZaJEA0Oy5tJ~h6sagEY2IVKEJvvHuyTePuTbdRbqdbyt3eIGnwYGgmczFFHtlXB8kFyGa5MA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 185000,
    "stock": 2,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 1
  },
  {
    "id": "buchana-deluxe-750-ml-43",
    "name": "BUCHANA DELUXE 750 ML",
    "presentation": "750 ml",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659670727-descarga+%2830%29.jpg?Expires=1795286758&Signature=hgneUy3VlzjYq8B1aU9m5eKusuoFiKj9PrQ7qrC9~oaZm8jKJi6v2-D9JpAvj7NeJ2x3wI6rlDy8rh74gNaPzcKUzHmLYfDdt2wl-QCBmslNTq-LdrPEkmZLobe4Op0sG-JUUuhvRK-Mi5cgV1essFoMAnYKtxm03-mzvhtk9EJZBmgtQgBhO1kvPTqauB7xxMam3kVBgfgC3FXMCDNgiijKnd-t0fJuBC3aGrOko9CKyQyBToHomtlio1it-GYp4XMzGBsTMsMjxWawOSQB9CbN~ReMXtWg8C8VpAcQwj5BNbPK7v3ZHDF~QbWRanDEDJvLJxREPKFSjbV6TAPD0g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 205000,
    "stock": 4,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 2
  },
  {
    "id": "buchana-master-750-ml-45",
    "name": "BUCHANA MASTER 750 ML",
    "presentation": "750 ml",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659670839-descarga+%2828%29.jpg?Expires=1795286759&Signature=Y-~VjlAQkMitJGEbZB1kG4o29BHdFMpHa4LXJ1XqUzQlUFI80~V3v-JehElydHT~-7JRuV5eIKpEo3tUnGQNfBSARA88vzh-77Aut1vFcFwXf8-KeCIFzqak2iz~3NAt9qVaMVewLZHl--U8fQH4drocM27WxxIRMAKGiz-gVr-r4-vPrw8fs5Ouh7OWMnIHjY0eV4I0lFTR4jaw9k5KbgCkfSAXPmskyz5c~pt2BVe9vCtupeD0wWl78qaJ4x6vMXjR4JIzlPARj-qD3UU9sRguLMXRh2L6mYrzhzI~L~hAfBivP6ELGklB4bJyYaRl4bIZ3ffN901KpYeawDtiUA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 235000,
    "stock": 3,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 3
  },
  {
    "id": "old-parr-1000ml-124",
    "name": "OLD PARR 1000ML",
    "presentation": "1000 ml · Litro",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148733-descarga+%2830%29.jpg?Expires=1795286777&Signature=Ey4K7w3ZAU9inbWbqrwCiNvCdo8vyQtqxlczDg9VMJ3aUUoBJfci8D-lD~cXwKGAtLLsBs~obklxdvRn1Iv46w9CmMmgnxChwXoJ~twU5ejJnUOCctzHX~B~pgjOws0yrGdyzgGpOpBwceuXfNKlYMqCfa4iqvIBMebYRpMRhJf4b6FBkhOEvW4l4dYb9qSat1sPyCRXZhsfxw3rZxAeiybIR5nn4fWTMZRiEkNdSGWF~qnQZ8jCWUwLepG-uWo-He15dCW0alLclsJv9hPDwqXZS97S~g-vGy-5F8H2TJPefCdO3CBQav3bBpToUf2ck7pzp1lWbced948ZYFlCUg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 220000,
    "stock": 5,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 4
  },
  {
    "id": "buchana-deluxe-1000-ml-42",
    "name": "BUCHANA DELUXE 1000 ML",
    "presentation": "1000 ml · Litro",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659670422-descarga+%2827%29.jpg?Expires=1795286758&Signature=hpz9QEUg8v4i5y6-ZAlWQgqWl48nFoEtxsWK-UwULPgsOPnZ1B3FEDktDCjms6wuMK2Xg18ofhZ-O9ABbj3RnvUzKy0mQqEmL6PLwSg~6MZsG-k87DM-uhL0De~9a0QYZ0w1bbTd7NIUc884i9mN8Fr3SOvJKq~bKImnweC4SF8syYxZGDdNNk53cxzjGV3UroSC5lTJFSxgRcVDQyPOSxnTYL-Ka~PyHmdytl1RcgbGyHNaXWjS-cGuftjkC2NzeopjKKJ~UKu5eMpzgIGzq7xzrGhrTAUlzzslO2Jwi~JdB8wuBMGoi6cj25v~TMpu-UkWbWwXAbwrFNoLepMxbg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 245000,
    "stock": 4,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 5
  },
  {
    "id": "black-and-white-700-ml-38",
    "name": "BLACK AND WHITE 700 ML",
    "presentation": "Unidad",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669466-descarga+%2818%29.jpg?Expires=1795286758&Signature=oe4LWN4PGL6FGPfN4X6VqknyE6e0yQ6txfRz9b4hSPtvsqS7eyOs3Vh60xxyo5pU30Nm~Z57aydY434Rpxv-n9r-LqACPRHGmRWNAO1230~pISn2fXKwr9OUAKZzudqnFMGBcSy3l7J2~4qBDUxTDLAjmXb61kGAX~RW4lEA3a4I4iPxrgnvINLBapVRRe7L2FB9K8L2rp6FIHLPFAx7iJx7fOCrmBu53-fKNNY3EHhNDBDNqu2D2J3ovAV661fbYwbaFuiVf2PNoevhw5L7ccDpFsYy0aSKsPmQaJi5Z29FZhqN6c6YT3H6WRsYUda9ZZYg6KhOYLh~XGgsn7mUxw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 65500,
    "stock": 5,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 6
  },
  {
    "id": "buchanan-pineapple-750-391",
    "name": "BUCHANAN PINEAPPLE 750",
    "presentation": "750 ml",
    "category": "whisky",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2491968/50196388_0_14bead8550d247018c4d7aa5728fc4c6.webp",
    "price": 125000,
    "stock": 8,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 7
  },
  {
    "id": "old-parr-500ml-126",
    "name": "OLD PARR 500ML",
    "presentation": "Unidad",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148703-descarga+%2831%29.jpg?Expires=1795286777&Signature=csbFIF-PeLgqCCZBMswr-xuBQJiO1LQPJbUQwyHBWk53jihpU9u9X~A6C2f-tsxyn-lUaFboP-9LHWb8KkrNtvlaiEd-gJHVDtxAziiNHAI6R2yj9pQdqWcB2BFXGt4HimQvo7eu-3t5v8naIcs7MRf3-wBmliPdlwAbPhmgU5ZAxG9qHOGrc8nStzfpIpeX-YAmoCkNdqTIDpu6~1yLDiS40av0-8s9Aja4D5V5t9iJ6s9vbKgs07rU0LvphXK96wz0gx0~8Vuz3cT1VVgp9-y3m1Z3VGOMR0nVGQZSmbdXbsb-hxlFgHUgov9R5IdTY7M7ulYcrXh64dhC2B-QJg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 99000,
    "stock": 2,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 8
  },
  {
    "id": "antioqueno-tapa-verde-tetrapack-litro-23",
    "name": "ANTIOQUEÑO TAPA VERDE TETRAPACK LITRO",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680714478-ANTIOQUE%C3%91O+LT+CAJA+VERDE.jpg?Expires=1795286756&Signature=LVpkOAQGzDDfree2x0y5CXnZuJyVmDwRRbbeMUu0HQcm7dVdejKgmVTWxXotIXgG82WmQvgNhx-TpkAynOe57aJICDwafXJnqIMfXHwvtBJPoGGN6Azmu8Wrv~4W6uuTnhZLSfsLgbm7siBqyc0-5vOnn0JnYIiUv6ZD22ywryy-62bFUcelZV7mixhg9EV~jbjmhfEgExumkQEtqyF2HFzXK0CtOIMc0B7Vn5sminuhTxB95MGWUC85XZy~htJPGjEESzQaJ~ZY0wOKb56YtLdpmQrHh2JJImeXkZefKNsvEJ9gzrnZ8g9kYJ4sT8T7NVwwFNjSB5zDHyeGQN3cog__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 65000,
    "stock": 10,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 16
  },
  {
    "id": "antioqueno-tapa-azul-750ml-20",
    "name": "ANTIOQUEÑO TAPA AZUL 750ML",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668054-antioqueno-azul.png?Expires=1795286755&Signature=oC3JQu0CeAzUFR3q22xVxrjJatO9bDZLZB2M5R1nL1uHvQBruBq5q-Pc8Fj1EyVyc30MtKbrjohE5p7twIMRBVNOL3d~GHj6teEfdnPFAxKqHtSI3GVOsZ~mQaX5sultqIIu2tdUXg0Dzzx76em4~hwen8o26GDAgznYHK788zdh~-2Rdx8R6mPprWH0TS5WktqCGuKEFUfcPp8VYzj98VBdfyvr~hfl9sdPTwQkTZskudtKTUqBRWGK338w3SnVnTdu9eV4W9JHwprPXA-smE3FeTcLaoP6WGIctJSF0BfcHPfnstWDqD-YmN9MyBgdRUUW4pwJMcACiT-D~hxemA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 58000,
    "stock": 23,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 17
  },
  {
    "id": "antioqueno-tapa-verde-750ml-22",
    "name": "ANTIOQUEÑO TAPA VERDE 750ML",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668315-antioqueno-verde-750-1.jpg?Expires=1795286755&Signature=eNjVgua31YKnY-lQJaWRKD6AuN1o7aK-UC-wcZk3Bv~Iv3rk2FbctUqPzTQN5QGC32HsbZp-U~VWESNHqpjZW1Bgd~2lybeEHR~CdzSiXQNNGaHRjhG8F-WAqEnIi4GT4omkFf206xOEthp1vXtNHSxA~2yDv3dQC2SwmRkKV214B57WjhtBfBg8poux5ZO2yfVDZz83-QE-vr2unBfzT-CKb56HI6AYtrYK-yIqAJx-oHJc3IR02FHL41tO7wrRvykSbLt4eCqNNGlMyy38l23ExXCMmVuLy3iVWtFbWAOcfE98U-aL-3Fiesgs~XSFRwJMFd5yFBo0TzsVnuET6Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 55000,
    "stock": 20,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 18
  },
  {
    "id": "aguardiente-amarillo-750-271",
    "name": "AGUARDIENTE AMARILLO 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1682124199-amarilloDisen%CC%83o-sin-ti%CC%81tulo-7.jpg?Expires=1795286752&Signature=VFCIVZtWCt54NqYG~edhaFls2FB8jth3u9nmHWpvXm7BQIbIiMe6zWDkCGsb-0oCvZZWZbCvQA8tVRfD3s1q52W1EtzCYev5Hf540x7~miigu6RsXl0WkXed~cqYAgQL083GVaOrbhqdrCKftIs4cRoxCwUMTVQbICuiHlDHjFKy-o-I9RTA2nahGvMxDYte2WSQw2cQDrlASxUCyZuR6laAQB3~55yu~QbGEjzQ3i9Z4RNgj-NtHi3Ax4ZCjuVEs7biEkuuYToJXpeY~v61RXW0rIeN-JJKCgTIdDdeMzX~7YdsRu7nwBs3ksUlWfiyRbXUHmjf3kJbpGO8gFt-kw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 60000,
    "stock": 12,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 19
  },
  {
    "id": "antioqueno-garrafa-1-75-tapa-verde-21",
    "name": "ANTIOQUEÑO GARRAFA 1.75 TAPA VERDE",
    "presentation": "Garrafa",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668210-descarga+%289%29.jpg?Expires=1795286755&Signature=O~s68RAh7rmBbTue-Q7gIQqUnEVEUxJ4uY3P2p9JmpPqQg1Azhul0fmlSxjFiv17LcIDoGn0U6lzWzHr04ISTctmDQEw1Ri9GRfXXVSfwryjk1mpb2V4b1EyVtdqgznKv3uxyq3hMVEJ9zpmgo-EKfBYEWAlzoN68CZOMmpZreiXhJP62xTDtpGlMCRJJHLZ0ii2y8u3ouyIJf2a4eNrnbfe~epNb52hs2s53YGZ3flnNLC-SmVFZfXEnRPH6Jn6~-LssKL9qLCe7GZSK2GcViCGy97pTA0zKA8I2tlE9SNqXdV9fBbkXrsM6hn85Y81WfNci-nVnevhHXYpiZXQfg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 115000,
    "stock": 8,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 20
  },
  {
    "id": "antioqueno-tapa-azul-tetrapack-litro-24",
    "name": "ANTIOQUEÑO TAPA AZUL TETRAPACK LITRO",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680715502-ANTIOQUE%C3%91O+LT+CAJA+AZUL.jpg?Expires=1795286755&Signature=KUjaZJ34ZmHT073V3bXm3yns0McNzUSiktgG8BmdyVmPDtdmivbKG6DhFGzhOtaihMPzqp-Uq7YIPOIqWFlpy9KNUgS7LmCYlJ298-lVUM1QpVW2OXTAJb1hGB3ZMMFgvILMeO0axULAt57WpMzVp-z4cBfXz2bpIHZ6t7sqer-kK7tzqfaMc3XdpfZgZbIrh2C2amcAIDfSPGVVFbKQfLxD~C4YtI1Tf7MD~tRLXGb91TZMYMtx4QPfwlRbY7fV6d0UAX2st0QLGMDReU8jk6TLvAalhHcaYX36DEJqR3M8wbTejJ~VaPzP3gQixZwRqEe098Ss5qdDdpr7WUwWCA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 68000,
    "stock": 8,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 21
  },
  {
    "id": "ron-viejo-de-caldas-750-146",
    "name": "RON VIEJO DE CALDAS 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680806032-RON+VIEJO+CALDAS+750.jpg?Expires=1795286780&Signature=hNlz-02m7WUT5j9hMX4G7OyHyH3ggjgJCsAEdmk~AacQTCgvaogYf7kjwyOWLQ28EtW75F-4sk~SUioWNwwk0G3o9or9AzNG5QYW~QVOQh~Fk9CLzYSP7kv4eIj3E-55NbWM~WU4i1o9PJEvYmFnQbTuQP2uxpI1BVcXVRQxNRqywZ3-013Jd~aLgYkk~KCNzosfZO0svA67G79CpT5Ytz-s3lTevjx9d8W9iI2fHv2CgILJpvXhysEXGHu7GLB22GQRj0SlnyebSnjW8qhFE3Ch~bMLZkqpg0OcRzDK6DMjYHEPc-M38MPI0l-6EBa~Shizt8AHceOnPeLwIwGZ2g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 65000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 23
  },
  {
    "id": "antioqueno-375-ml-tapa-verde-19",
    "name": "ANTIOQUEÑO 375 ML TAPA VERDE",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659667956-descarga+%288%29.jpg?Expires=1795286755&Signature=LqGS7KERONAGpze9PwvYB8MVIQA3FV-T8bhbXimbdPwLjGCSGyIrKeylCnn7Iva8kuga63NXGl6-2kZHJvMRxlMazQ9o0DxJOILv5ZnR24Dh1zBhqPPvgvhSrsO2NP9UPsAkF0jFOlgZfyxCxyuiUB1MdoPIRyezSXlMFJ0x54HOOr6HZK1fLojIQZ06DQfFIiAOXepoGWkn7Iqv0xLmeyjRz8Tr7jKvGrHbCxd~uSss~bF9kvDF-eeJuQbQt07oJIs4PXLj2S8GL40-VVAEnKzu7Anfcigh9c2HQlECsR3PK4Ctiy4ID996U9GdiiQlengw-EMrIRRKxv430Sz2Xg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 33000,
    "stock": 20,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 24
  },
  {
    "id": "antioqueno-375-ml-18",
    "name": "ANTIOQUEÑO 375 ML",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659667896-TapaAzulMedia.png?Expires=1795286755&Signature=VwavKmwlvn84ejnI5-~u-~4H3zL8i34d27GGjJ0r4V-3f~0H9Qv9f7cVHGFgxDxzrWfJypMzIxsnz8rvTEdqKmxac52RxT2NyOWpozPgMVlu1YWNptvnY4CafNCLpFMO~JLTEyl-33M~jQv~EAJQnYkIoWTDBS5ULnrR4oeyziv2jf8~VLWSz9aZPzmC-QEEDkXY~oO3607N-Fh7GKk-Mdx~H7G5WpHcw8S7VKhPu5XdnfOAri0NXdsO76StnPiAVgZcyvsRQ9nZFgdY8NTC59VxeKe~yoJT5w78VdNMwg8R0NZSyd284YoW1qZnZj7r2ZCMt5OpcNiXAT6W2AE54Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 35000,
    "stock": 9,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 25
  },
  {
    "id": "medellin-3-anos-375-117",
    "name": "MEDELLIN 3 AÑOS 375",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147978-descarga+%2819%29.jpg?Expires=1795286774&Signature=CSTbxTYzER8vt~03YSVrS081ekEsrILZlQFg3zJdWL~vDPEel~yuoMoPtVlRKUjRttQdIKCzWFD1pfSmMt5smxvasZ4IhXgAbfhjaG2-QsJmgq0sTZwA4QXG07lJDcBpKbkq66-9ofB0clPzx9ug4Ot0FNc3dZp8HIKkyvNE3i1sXXWBOhlGm5kPnjMwxgaB9mh5Pcf64tihxix5luTeab1TiRwcMAx4uPzHb5tWdflcHiC1sIYz0JHFM6RLiuTcFJq~HxI1NlL8sobCe0p4TUpfFxEA4gPXxTeJb7gjGnXsm~bO5Az8zUUaV05ITrt4P8mQg~8Pu4zi9EnuSLMdUQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 30000,
    "stock": 4,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 26
  },
  {
    "id": "ron-viejo-de-caldas-375-145",
    "name": "RON VIEJO DE CALDAS 375",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680806081-RON+VIEJO+CALDAS+375.jpg?Expires=1795286780&Signature=bff06xRta2DdP6GLi6vaZFdo4BmVJ17VNN3~68PprCpIsNhmMOHpAxMnby0QoqGqEnM2XOE2ARsEHKdOUY1qHK2yCfMpts49vNm3jdm~djsjo64FgZjwf1DIeOk8YfkxhvMXpyh-V9MaUBwTwyVEow9I1r39eth6JiMn3Zc7iwnRlZajIKZdlLYrBsmXFlrumnfIot0yzHS3S0tlTBQDZ6EnJ7V6D-pgWn733xIlicrFms32~7o8ZgYf1gFQrbKqkm0apCmFsvp5QgjRVpIpXaOTK7JzdP62lNKyVQOJ85vzKF~fiBXyWUtYqB-QZys3PXiA2nwYy6E6qS79gTn8Tg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 36000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 27
  },
  {
    "id": "aguila-original-330-und-13",
    "name": "AGUILA ORIGINAL 330 UND",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659665396-aguila-original-330.png?Expires=1795286754&Signature=kkmmw-UMZL00tZIIML-7HgHgfqaRf4SlH5y~BjPEN35XOwK3vhipoZzKICNMMObS9ddHOjExLuzJvjJgH4pbVizHurGEcojpPQtt4tP-zZZYgh1e7-0gajYCHVTdV-OqXt1bQKRPuXeThHFfcnHcjzvt7043EK7bc9mIVC4iNT2rmJplGXSWwlkvi2c3r53TxAO4aZ2jQJycKsgFuYEvZ2OydF5F3Ap0jqb5gCVjbKtJi77STkKAxFBPG1kY8nvPRFqMTyAEoKxe8sNQUVwtb264k1IFOtIVCuZS3pmjTgdT4OjilnW7RZRTQxtkeD-eUB~JxvFUoubO7E2M3Gg6IA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 504,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 31
  },
  {
    "id": "costena-roja-330-und-335",
    "name": "COSTEÑA ROJA 330 UND",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 2500,
    "stock": 795,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 32
  },
  {
    "id": "poker-botella-330-und-135",
    "name": "POKER BOTELLA 330 UND",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680802546-BOTELLA+DE+POKER.jpg?Expires=1795286779&Signature=n1yRbYp8~JRuDQrHTo3pPJkWZAH0svlB7TsZM~01qeiv4t1-aQdNri2YGEnwzTH9VdJuxqDvZ0WlHkrr0wgyHkmh8HKQyed~4ymorbkJ~KUtCzcv0GTjTyIx1M5JnBVIi7U8Xqid0dXQSuBXBHOLTx61S2-tusUuA7-yLds-kgT7y-dHzsyFuDdFjHOvnsgkHE79427HkU6hxoMh33A5ySHI9eT7VxLMmpJ8b4Cw~uBOE-MCZqtxazo4ilap-Am4gioI7Ub~NgovQDqVEwbGDNMao~GJgdCtOYdRtPPULH6kn72Vsli5OJFlqhAHD00RGMACZ0NcD-6qF0lI~ov6xQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 204,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 33
  },
  {
    "id": "coronita-und-76",
    "name": "CORONITA UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673903-descarga+%2822%29.jpg?Expires=1795286764&Signature=Oj33Nxd8XMcpaSK5b9amnH6QJ5GXmWP5hXKIHD-nBwJt4xhTQyKDBfc-9JC2YGlCNMbGb9RoWvRxnsNEgmhjbVITPsSKGk3hyo8r0CnF1LLStp-lDXXxF-6HnaXRkaqrj1F7VR41ThYlLOyZGdUH2OPYjXEPGWXSn2OlPrKKau8YvYRQ96tXWjpoAblG139X-FHW4UFo70~VIegIFYekZ50UfEGH35cb1Z3hZfef94tYd8sKfLZweHgJs9A~OzuLGkVUOLDFhkzgyPOFIi-dewujQ95iYQi6FCAMwVHb42R0ccwHKoxeGDDPyeTT1MNCkSseXxg-9CYa2SoyyK1mOQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 4000,
    "stock": 1042,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 34
  },
  {
    "id": "corona-355-und-73",
    "name": "CORONA 355 UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673549-descarga+%2819%29.jpg?Expires=1795286763&Signature=WSG4VOuEzvvNG~MopgUYBwW8oOhFlQqEv1ow1cnPbIeTQI3S1b2ca4rVZ4pZwaZ386rjSoIuppbbWPRiNOZ7LCEfxYMIiIEPDIFi~TqYlMHsob-cW7x-9nXlcZVeEw4-ocTNHP7uUPF4cztflWlYKP8bvQGNJ12w9yvFXvqUKJQyYoahLZtCzKR-rO~HrG3AbnIng2KOfixmJ5X4qP~yrgKKcAZu2f6FiLX-SR0hR6RookjOU~JAlJiVjEyAbm3tf-aYYT4udAuJZDRqheRumew0UsRanRoqbX2i4uCRYMXaczcmLszwgymlAJHDRwTWqqw6~6n-jM~3Lo6v1PSnAQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 7000,
    "stock": 93,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 35
  },
  {
    "id": "club-colombia-dorada-330-und-62",
    "name": "CLUB COLOMBIA DORADA 330 UND",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659672364-descarga+%286%29.jpg?Expires=1795286761&Signature=qFZlB5Mq3fsayxW4we4RvYUgdWkGexbQpwIoO69YvNmGuUv2Dl~QWg7j0WeQ7IHNaXDeNAZ-qg5YPB~4MYA0oL34zKElXTZuemo-I9FDJS4TTuw66RBcsK70QpVOMRDYshu0w7lXW7WQImLRGhESCISNJj~5rjW7vj-PZHKW~7PNLEVKy~0op7yixdYxEJok2BvDCRIVwlX7zIakj6sPvH4DLCfdoHWCTb1J98uHUWeDJLwn6GpUKdtVpMK5i2vHcd9YN1yjn5nboMTw1sYh8flG5ldIuKmGZjIx1rzMItGSbHUx9cNKDcCzWYqt0YaBQtBLUMZ8SxrkuC6FaozYeg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 4000,
    "stock": 221,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 36
  },
  {
    "id": "heineken-250ml-und-96",
    "name": "HEINEKEN 250ML UND",
    "presentation": "250 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676832-descarga+%282%29.jpg?Expires=1795286769&Signature=SUP9XzDsJS2wNwqbz9hC3uWqsYE1pLKaoWPyow8UxSasXSv9Ar0ubl5DrEyqEXfrpJDCooi7fexb1urSOE2yKVdyPNWJIDhQ5b~b3dhjGoLmBq3FiabTBh50TOE8GDxL-dGjnSmcdfjWA7NrVtfvQ2bW7PWKT7xmCmNrmL5eYVIfOoJYjemmd05zntKpqnmy~nHHiTsomUObtTY7inltXMEk8cze4uTRwAHOA~qpW2eWDEyQf4AGdskINBl0te5kNhQxXF0~3WOdB3D6Xlk7aaPn0NLOvlZARD9pPn9ai-xxXDEWlnDR5YqcASYMDjLuOvsANbUnQMXFoo5ZsXEXWw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 798,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 37
  },
  {
    "id": "costena-bacana-lata-und-269ml-77",
    "name": "COSTEÑA BACANA LATA UND 269ml",
    "presentation": "269 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674213-descarga+%2826%29.jpg?Expires=1795286764&Signature=oD7MqDwZxq0ckGcMdd5AphRHv3qR0jgTTtA45zsr5Hdx0cIOKZC72MZR4p0y3BHtoc67DKdW6lGqx-4q~ZjfU-5t4VA~dSWvtPuHO6yC2I4kmoTjLQu-PlLvfvGQ8uzSYCmO40B-5UlmYv~yijp0t1BAbtZiRFChREdjpahpkZnfZLMvV0KV3PWIbcQU8mUDbqSS7WAUtimClpwvuN9PR8HnFl4m5Sd2LYn3zniHCihZUBuGv5XTomnog6V2nG3DfT-uuAnaFMr461e1ZYfQ4l0o6RB03AYGBotAFGXtWJyLXtF1Wp302~hH7hIUt0fz23JvicC2ex5rwawnpKR2kA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 415,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 38
  },
  {
    "id": "aguila-lata-original-und-9",
    "name": "AGUILA LATA ORIGINAL UND",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659665067-descarga+%282%29.jpg?Expires=1795286753&Signature=IZ43dmeABrZ1Kj5jW4DwboPiJWbw7GXB1uWHk6gF9ai0g0sZ20okbjQN2Bduo34eXmac143OKDgz2X9Vfpa09iBwPGADkm2jxm~spsQdmTl5g1Yk4Rxtnqk61Us2nkhshjURIODVdiAgOi5OlZQb0eWV7-hsQ0XPwxZ2FWrC2ZYMY4ZBMzbA9s2DFIfOGpdEGji34av08HUaCZWh-KUl~tJ5uikjUApZZgGMLWIDkcydo8JN~bTVYRVC~j3K8mii~3gZ8uUlT664l-RBSg1O3vaEkfHZAWMK-I8zB2tSIUJ3oA1hDHE7FxqeABEAr9ScveT3Ij1UZHhD6xazyD9I4A__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 4000,
    "stock": 322,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 39
  },
  {
    "id": "poker-lata-und-136",
    "name": "POKER LATA UND",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680802922-POKER+LATA+PEQUE%C3%91A.jpg?Expires=1795286779&Signature=dSjphkhNKELsUMyCiPTpdE7UXA2xV6mUAwtME693dS0FsztIxemJ2WpbNAG~3kQtRuKZUevRljFbK92JRUIe6oFV62FkGoHWCboAkVuVLLGLArf1oGwu0OopCtaC7FrJ22vObHqrwI1YD7zTwW~Y3vJgg2oEWEke3rQiQ--17pV7yA26WEnYUIK8l10wTr60Zolt7EAzwBAww~OISwhNHUWQ4oWgRcKHRnpTCJBxolSFklqYMx4zSHxvE5Id8RTItWoqWU1hA80boQ-2f5bhJs9czkr2GZyEjUxPdWnnU36qTXybQAX9MJyOSlyUaDDN36onIHpNW7qICoGqSxu5Dw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 4000,
    "stock": 232,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 40
  },
  {
    "id": "costenita-und-78",
    "name": "COSTEÑITA UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674601-descarga+%2829%29.jpg?Expires=1795286765&Signature=Cf7vQTjWSvvwVJYo9kQCLdyPvPKz1GX9OH9XgHfOMHKPQQRCy~-4eWF3vkcNNehdIfaDHk9ACz9j~yjMXHLMkeVYEZQttY-dECs2tmSwc~roF40igjd4dAUpDbpQ8rZJOaJOfNor9VLBK9BpjNIqxGJvBwlA6Vd6fMUGm1n9eUvd2-VkpovRWitLDO68OKGYvCHIKWjdqRunlSfgboDlNMA9LY0bs429FQv3XdCoKqP-R8hwmovi~utUoZ0B3HTwbPhG-VJcoeHn~1oQRBHrtfaD4F1iVbq~t465lQmaUuZoEi6akUzCe8dJErQNjDJH9etnO9NeU~lXdPwGXjeUxg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 207,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 41
  },
  {
    "id": "budweiser-lata-und-47",
    "name": "BUDWEISER LATA UND",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659664179-6615.jpg?Expires=1795286760&Signature=dEr1LbLyuHjkHF5htXd7brHPhxp80L98plwpzeWBWHCaosGC9~y9IsShe-RvaJAdot-g6KF5V1UeZTYBWyyDMsMYT9SUJYHmgm4W8ce8EL404EITvfWZzH94zq1mKdg3Gcbg0WnEF4aTXP8Y~jHXoaQ1onuWi7y~3tbbfo0sGwR9ncOaWpubK9NuVZzQlcymnUdMp4u~UzuIL9tDc4kCg3e4yGZlbE44hiME1E1hKG9gkps-ddP3mnFSVxcMMz1YlJPtdj~3kRZtp3vqi5t0s~3ZFdIrfaq5yvKADTsEgzgPv~u~3PaxOYv9pLz1yH1Qa2IVeWuRUrVxkDzI8qaQkQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 218,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 42
  },
  {
    "id": "miller-lite-und-122",
    "name": "MILLER LITE UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148428-descarga+%2825%29.jpg?Expires=1795286776&Signature=lF3sDozvqCJSwCrYBe4QYtValS6qLIl28o6QC9mZ9qDGfsGNZfRhBBPwiZKYUBMfOOrRRo3114xGlEkQ~8aIVoLJavZ-K8mBOyTCUv6p1kTlr5TWPoDNNwg400jWThsK2Y-xVMaA6JtiC6~HnKOIoirUxndGxCj62T9WvEWgmNwDIIWADIQvW4hkTzvQtIC1zRm8wiEBPQ0JaX2j-m4j88D1GmjCEuduXfUxcrGWygmuOLWHAjxm2SZntLPW-BlgtSDYkXh7zzldo8QtKt0v~bt2B~2zW-6YO28m2Gob6OgyY2~~5twC0qGrpwosOF7cb-lNj6GhEa9cbd2UjDZSLw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 195,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 43
  },
  {
    "id": "sixpack-coronita-346",
    "name": "SIXPACK CORONITA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 18000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 44
  },
  {
    "id": "sixpack-coronita-250-214",
    "name": "SIXPACK CORONITA 250",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673933-descarga+%2823%29.jpg?Expires=1795286782&Signature=O3fswTtpMJVLehBOdB~BWkFvATUpilleZLIvvdiTYAKCxiNabGZXwWE8Ks~ia2PSpEyhVzTnJN4fBg5hIpuSXvV7rbbMXKR1h02MRkcoi6o8L7XitZjKzMTy-o2Bl99mEINHrFZTIejwk5IgGxh2VrWdIjLEwvxA9DKmn84gYH3aty2L9otHKtROJlK-RIXpJhg3w4MmWqdUA19T-bDcBn~qZViDHXIsIx2Ay~iirxNvI2eDuE1tAHklCiqkENDP6GD~2FQ978LooP4dAaZty5zrOStaBzhCTC484c-YxTNEz4JFeTLpRkgwJ~MG0hJ9J~7PYsZhlXYqkDz-d2F4jA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 22000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 44
  },
  {
    "id": "sixpack-aguila-original-lata-186",
    "name": "SIXPACK AGUILA ORIGINAL LATA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659666324-D_NQ_NP_892934-MCO45130334061_032021-O.jpg?Expires=1795286782&Signature=An8ZI5mPAkNgqbUU~6wWImlH8pWulLLG1LtwhwJlllKsuLhQNN172WdscrGqW5b4G0hbL1zKrEqAf9saZMhzwKHlEQHHTJFSTGbJ6w1mqtIh~tBdRnkkwuIQddzAqfjx8y5kDty9mhSFvSPliQ--1LhHldPjNWpsMbK4kOacAa8qC3zinwLrza0JJxLWIBXGi~~xhtplwxGNt8iij5jZRPMiELglavvGQKJI7mM7qgt2GCtzGtMA-XR3irWDOCXcrNJgj~nyW59MMmedWbhZITfuW6fNvPlFM-rZgIH40yi2vkCQkfeAv6oDoQRpkKNFiKDyZaUMbKnCpgNcdvXVvQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 23000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 45
  },
  {
    "id": "sixpack-poker-lata-225",
    "name": "SIXPACK POKER LATA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680803039-SIXPACK+POKER+LATA.jpg?Expires=1795286782&Signature=fTuBsqXUBOZkeJw2v5YEKhX3D2jDBy3tdAs-E~aLL~0qO9RSkHRspW-EdtqckV58x6L8fYcmExfNKl~NHG8jhxY9wH69lxqPBZ9AfhTvuTxJ3Rjmh8tfBdqVwzhkMxbP7Rx~JCZhA-~k2GHuofONh-SnsfbqusJkW8EOVBtB7AzrF-uupfBV-~23FxGu3Zyp~~bKPLsL6WHAFKn8E6g~X0eIJ2fOWfPtxZfWej-G1-UPsU5gIB8NbVeyf8wE42L8LAb~CndpIBnrwlz4ITh09r4oAFKxVLHhvFZ~PB1w0NSkOqrzOa0jhvqsJtPUOBfUgncgyLRBK~fX4h1YJj8YnQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 23000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 46
  },
  {
    "id": "sixpack-club-colombia-lata-dorada-281",
    "name": "SIXPACK CLUB COLOMBIA LATA DORADA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680716919-CLUB+COLOMBIA+DORADA+SIXPACK.jpg?Expires=1795286782&Signature=IKJgsmIIM3ZhD7cNil2MgmWxRVL4SFSX~~lLGwQvyL3yQWE-138TeYIvL8rMJvD11YVIffJifxJ5u0MIOVJRmK19WTl9zA6SGXs8pIcoGPUCx1z21U-XAGRKAvHcf2xRMJnMiUzYLC52lJPRkP-sx1sy3HWV9nnuKBMq9V~IKfxBWLXoH9Xwz~4vGqBDJx3FRBo5V4IIuABFZ5FSHjAAbhljUYvKua6vhQbxAxTXQlRnEoQFWhXc2gmUvWU~XeIxXBd8M5G091xjHu657DZ7UprkQclvQwd3V6ARFv7yzi1RKh9Uaby9T7IkP-ntPdE-~rJoZkEtJ1Nw8KdGMf5JHw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 23000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 47
  },
  {
    "id": "siapack-costena-lata-269-ml-218",
    "name": "SIAPACK COSTEÑA LATA 269 ml",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674194-descarga+%2828%29.jpg?Expires=1795286782&Signature=qDEu9IvN9-gKx~b0niadS6ehH7NdKDvgf79JJOq4ppWdsLOQ98WC2grG0kF-Lxst1vUa1jNRtxBV7EmPT3T-vsSu4OIBSAGcmyWZRwjLcxwNTmnJevL1AL6v5wETdP5CF-8osILI1lsH6bBo~wp-qy1POrrNY1I7C8AXvtbd0OUB76Jh8vm0M9V9KWMJSbzA6bmgJxHLZV1P0EbykEPuD1yL4XcWfpjN~Bj71O0oelyYanEG-~zqxWRW5~87SHL8vcOupurdmOw3S3ze0QJSjIOOMFKoRaEJmSel0Qu8-TGgWKeXQu~hJwcff2Go5U1QXPba3rzF6vWVzDLpb5Q5Lw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 18000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 48
  },
  {
    "id": "sixpack-heineken-250ml-311",
    "name": "SIXPACK HEINEKEN 250ML",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1688600969-250hine.png?Expires=1795286782&Signature=UzrTcMAwflykAJ5~hzsSMJIqJwurrjuraiVqJqd~EvgA23p3JM3~OlSk0LF-WRfSqZQ1z6vO~JPAF2OFwLz6X1czKzTVtBb2lZQt9W-H5JUNGyYUM1hpJrDuDAM4WM~pys0azQvkvHFc-nEUYE80lHxVsOmSH~Vb0rGnVa9Uasvk0yEQTU85loqgctVqWkReRiHBM7~1Qn~53ZsG1h3~P6Z7ksVuuhpIiP35iAlWuwIPxyfadpER4YgRsjlcDhuvBepux-ux6QLt1JRYEzdbMwgmBfG1qwgp0rrQVdDwXwYObtp5I55cL0Xa0cS4it8wdr1MFvVq9V~NqwAOTrHZLQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 18000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 49
  },
  {
    "id": "sixpack-heineken-330-199",
    "name": "SIXPACK HEINEKEN 330",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675942-descarga+%2852%29.jpg?Expires=1795286782&Signature=lPzzXgEeDux7zlDQDqtQrY6Zb0SwzXQC9K9xJVoqWsGbaSCw6BgU9nWRUs4PzPLLj3DG1PH2jDGyyf4BO3wLaaVOJauXXQkEHOqTEaP4FmPXlLEXlPEs32uD7ILtdUY2QkZAAbpH~EPEy-0DV428jSaAoBRxw8P6uxD0lrhIfERLEZvYNtHlT5ugneQnYcBBaeaDzBOc9ST273Yy69HBahJ4Yrke2vd7CzCEl6VUCrQyKWBw~nWSEYLJ07N-yfBOcxStFtFxk8RyD4Qk8Pb84nl-tRgMqDLK1QnpcUDivakc~Z~gIvwzNwzXWoMPtESWcpmMucO9LkdvtgxZeuUrVA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 26000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 49
  },
  {
    "id": "sixpack-heineken-lata-222",
    "name": "SIXPACK HEINEKEN LATA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 18000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 49
  },
  {
    "id": "sixpack-stella-botella-204",
    "name": "SIXPACK STELLA BOTELLA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 28000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 50
  },
  {
    "id": "sixpack-stella-lata-206",
    "name": "SIXPACK STELLA LATA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680892593-SIXPACK+stella+LATA.jpg?Expires=1795286782&Signature=XC7SocHGP8DiElCznJ3W5a9NcHFsS5sldxwxl6wNqjVEmHQ~HcPPQoGAFscBHxf7CPrMFNc~N4oP8SbJmpDDDYQ2QO5e47GUYaWIew7dzYk88KdBi16Cyi0jJ8OOzL-cSPTOSw-O6D2TX~AECyyP4K1GjU0NqhBRW4gWGpNqdLspvEf3uEENIESpYuISeQqZpii7pYamGWsyiITNcI5VspOoataj3yBJh8CIbY-fqiIOvSebXh7NHyNf8v23n9bzUuEoKdoBUtf9qArgn9JwMYF7HgIC37C9PcWDorX97fVp8ouZdEFGRuDPsv~nSJNgwechwO9UH2O5qOciTJipQA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 23000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 50
  },
  {
    "id": "hielo-3-kilos-100",
    "name": "HIELO 3 KILOS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676199-images+%2812%29.jpg?Expires=1795286771&Signature=fyem90k46UZPUai2SxrsmPT4G0bKIZpt46TggUye-1xc8AuoPA~VDT9OlFDghWgfd7zNE6C~s4PAbdcm2IjBJe33boYE~6sDHbyYeCLOtQ52kThpKMsLI9PrIj5P0Ysv1wejNANvunxNOjNid~YM-cghwYQrqBqXPMNMBTAi8SKVGhsxmVEevEvdkjsMbndCABs-gGRuba9wZEkFg6sNEqQPAOdAo2OJLIgrOZ1NW1vPsrplvVex-BJVMCkTt7Df7y78zivXLjo3KJP7Nz-asuebx-00S7TXiCoVJgVPITWZ1A~Et~SFKk0UfSd7zg2A6z0Mar7BlHSprjg6nJktMA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 6000,
    "stock": 18,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 71
  },
  {
    "id": "agua-cielo-278",
    "name": "AGUA CIELO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680716016-AGUA+CIELO.jpg?Expires=1795286752&Signature=kZFNfFaBtq5QnICgmT3HHGy4q8rRzE0iMYRYX9-RXQY8tdnM6wIq3mwZ6VX7pRjVjBYhRtvtyvxOGXX~~Lp9ivBwIU0pSYeZjsRjMhfKYSiBMvpchqnWeIuGgybz35h0rktyLuL19cXSYRpz1keIWoEl84K7Wg~KoSMMpxgp5Ou99kuwYjrm5nqSlZFYf8pJ9SZ~0ZnUCkDEMWY6X5nYqYrV7m9L-L0jQZ-4ixeJOMJKfwwM7G8kyFZ2CE5Rjv-2Fb8T9UFC2zyMPPUXa4YDmwW1ZBIU7ZPYGlTi5qjqX46muMjoW1jER~G~6mUGg8NDO~MkSRsYuDobMEyawKx9ZA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 72
  },
  {
    "id": "agua-cristal-con-gas-3",
    "name": "AGUA CRISTAL CON GAS",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659666903-agua-cristal-2-1.jpg?Expires=1795286752&Signature=fbPEV0glOPNa5Y02OV~yDq47QTjob45MD-JZwHD7KPJZBMTPHQjqSNe42PuQzaiZkWh-qMZucqEDcp9EsqLcsBMbzbU8al8niHbvVxrdWAgGu4k9fE7TOVya3YqW3ke-KcSvSYWHfUVVA~6Ok8j9qI-k4TaYBvlW~XkaEW7lOF~QQzBYmqsLacuz5R0jocYa9V88AktIgkmK46YstT-gmCnHldC~oZDAJIzarQ2~U-l65~WF8e7B~B~3KZBEPPSYQJaIpbHevgvGeK9FvbedYYkpPRV4a-xgUD5eKODvbVkMggO-ZalgShC2D99QILDeyWwoE2QF4SVryfMbm6Qfbw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 72
  },
  {
    "id": "agua-pet-600-ml-270",
    "name": "AGUA PET 600 ML",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680716498-AGUA+CRISTALINA.jpg?Expires=1795286752&Signature=MPtEG0RLQsYedZ93GtMSUAzzh6wjZDTwo~a196ejIBBmxkaQ9N5wqOasI4JqgnN~KaGUlDPpABpfJJFCt0CatgTNtA1-66I9xIpaF4FIcYsgauMl7CbW3JTWAD7eiRHJUgiGkk1KuqThag2o33MyF0nnQLOEG0yD5158ZvqJGSTABiSrBWVHv6xgnvgsSaCk6OUw5gjhs5naXeoWVxxIXFV1Kx457mMfUg5afqDxzNS6cODFnCi4cPmmr~q18X9dBnZc06rGING5GajR-ubagjMhz2gPU4scVtLjDn6~54xrcvvhLz1od7kT5AiRiBX3-FF2txIBqpKryJJODw-CSA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 152,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 72
  },
  {
    "id": "agua-pet-600-x-24-323",
    "name": "Agua pet 600 x 24",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 24000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 72
  },
  {
    "id": "bretana-1-5-40",
    "name": "BRETAÑA 1,5",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659670252-descarga+%2823%29.jpg?Expires=1795286758&Signature=R~4h2BVSHhACoF9LyubaByTGfmZnMyI32GmbIoK0zlomyH3yGhkitnetooex5M34GGtQuXUiY9ML3HKiB8GbGStZAIyUR2xX8QYf8qAan3zNZvk5dIqQNZ~VGtlG6eKT-lVemGl63ZUtlEzhUd6fHetdb~6C~Np91BxxmCUWlQovHaiLXD5IedfYeFCpe7QywlN5zcio4ySeTHqIMM2H09LFR9sMtcCiF0KeQTEj84LfBiE7dWo-X1Jk-xw6yo2w7obUrRk21Td0LmAuKoL64rwHMTyutSIPkT4PQc0dO~dIZ-74q~h-vBpfUkMzyyux3mp~OWc5D9UDS41La0Nryg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 4000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 73
  },
  {
    "id": "bretana-con-alcohol-lata-329",
    "name": "BRETAÑA CON ALCOHOL LATA",
    "presentation": "Lata",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 73
  },
  {
    "id": "schiweppes-soda-pet-400-149",
    "name": "SCHIWEPPES SODA PET 400",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 73
  },
  {
    "id": "soda-162",
    "name": "SODA",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680806422-GASEOSA-SODA-BRETA%C3%91A-10-ONZ.jpg?Expires=1795286783&Signature=HuHSBNE3BEMDbq00wCC8eJ6OpjskYTdi184OakhwkgyELNlhf0ES-ha9QV-h4yiwJFkEtbxYEtZqPJ~ng0D~cHbQhkJQEWMlrOTb-NCaa6SHuJWhCguzZdYrrbErQXrcodYdSxHz0q6xnik8L7szDTPns3PWzchCAldWi4ejzrKpuOBRaSEekjvMgpiaT3fsVxY9zdGobTJwmyYvUqS7pFK7KeYHrs4ijpqEp2sdm5f0kmaS1~06CKZ~hp-6ZMGdrCLnAmirRdOF7C8TGM5IYmhk1kCSBysbGEx-ChOQwhOXO9Gi5vTAyF~kbdJCG4htPoiFbEFavlJoLISlNnLLqw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3500,
    "stock": 39,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 73
  },
  {
    "id": "coca-cola-1-5-pet-67",
    "name": "COCA COLA 1.5 PET",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673247-descarga+%2813%29.jpg?Expires=1795286763&Signature=GfkTzK9PqhkWUeyZw5DxmuzqpuM~jy4Nghue3Hrnq4t9DLloZToBwO1qSHa8srw8WfwxMq~pr-pNsxVBzHRsPkAc5GA521EHfMUpKLdzy7pktJw4E3KIFPT6lYPCfPcVLTUkVqGQq91ZHPvmGVueuaUzmfulqa2bIAsvIk3hDuYwBeziALz90SlJDdiaYBi8cPZOA544otRBNckYhtQRH-sReZoKTSKkXr~GVRPe6hYcxrZm-D3OPZqqoPic2qtcg56b8uj6MbvgagI46FxyY~16XYKXzyhNPKLCe6m~4i7xMffaxtALn1mfq8GD4shXii65Gxt1bSC7Am3jzBN~sA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 7000,
    "stock": 2,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 74
  },
  {
    "id": "cocacola-400pet-68",
    "name": "COCACOLA 400PET",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673288-descarga+%2814%29.jpg?Expires=1795286763&Signature=mYKo-0uGLdKtUZK0EkNBZJP~yM2faM8X0EmkD6PmHB4O5r8tez~VHD6oqPz9jl0tsBDVp0P6u9DbbZancQFsy8oOxHNNdcs8oPg4~WBk4qCjxv1yGcnCP4H3XzoyWVpQb8n9sNGMmquTG4aDoLVu1e9T76M3uZ-DAIuM9PRgvXHMyuXydasX61MyqE~5D4vthRuhENFnTxrOug1WgyIPQIanXY21lsPkkE~7KJqe3yrkJO2SPm4JqjbxuX6RuYk11z9irFf60k-NsMFOac6FmG8yGCdsXb~oaKeN27JXvHhjB-EhJ4RQjPECv0DADPxUXzfY3Tyaok~hfpujBZ2zFg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 5000,
    "stock": 10,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 74
  },
  {
    "id": "cocacola-cero-69",
    "name": "COCACOLA CERO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673405-descarga+%2816%29.jpg?Expires=1795286763&Signature=fzzTi5Qvt7LK0VXeW0nOmgZkWvHpDY1Kh16qgIzdEkbqkpgBIK0jkVPi3xwREKTyFtAgTz79aNU0TFunhh89WJxr4gSmzf-tx-F1eCuMI9-fROSajB-muXtoVrB8oxNUM68IVRxnBOAnMNXQcdDiX90vKOPsG~OvhviBpN-ejKbmzK8qGTyHDk7QMUvi1lDEPoANPZQk4u1wuBXRRPVU~hrhy8Q5G40vgfdjfr~5iwQOa~x4LmsohYC6n7YQhoXalkgl~EonjU5cOnsuhh6MVGnS83rBHFOCb2Z1-OY4eW1ZdDm~vJivyOUIvOz8vXKw2A4U9LE-v6qOR1wkTYJebA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 74
  },
  {
    "id": "cocacola-mini-70",
    "name": "COCACOLA MINI",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673360-descarga+%2815%29.jpg?Expires=1795286763&Signature=fRPdYVLLwWBfi3RIG~bxVjGKt16sNaO1Z4hFL-5WDuo7B5wmQ1oifdzWh0deNockJxZclT5DQFo3OukQIVB2F4DuOgUQrt7~hTYAvNWKhTV1SOcrGwAxe5xg~Dkpp2vlZ4ympAVp2duHwKihzRMgjP5Lxbwo4F7xmlR6lqTPbjEpLX0XwA~WNk~LyS-ZZGoJGzLu0BkJ3ETuft7U-oWWYHq9Z-O5HzSNRhhYIVFWd6lljwq-1OFs1e61b0NI6qPHePhKbOyzF2wOSnxXQXWU-1A2-ywBY5FXvozo6TXpVlhuAe8hF-u1R4c206aJjdO7-4t4Y2rnxQ1wFVRpS1TcHQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 74
  },
  {
    "id": "gatorade-93",
    "name": "GATORADE",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675447-descarga+%2844%29.jpg?Expires=1795286767&Signature=NJCiFrzvawyO7p8UuUV88bNtI7ivMTGrKWxunAJUduq~RQ~az4Xvl7A1SYhT3w~bBpQFhUsCCgvWDqeW4W1omruIuyQWMkLrCDnxP8PgOw2YQSt~daPreSCPvurdYCmHSPB5brTKTSfAwkL4gY5JrR7r5PAPyCBiVTIA2Qw9QCcCzoSEPE~4ciYYPGd4A1wtqUmcnABAaKCfDxRzpAe~DqnSkxTwaATeGa9Bf3sPjnNfXcbtZV4HLfu4DZJfcZN7BGXtmwxn9HK7j31Muw4prw98G9hnU3fSyVG8vRdoNEc~J5A1sImc04izn3LSwhQ7FCX6YHRNQ6VaMGaPkCiJ1g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 4000,
    "stock": 43,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 75
  },
  {
    "id": "gatorade-pacax12-195",
    "name": "GATORADE PACAX12",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675478-descarga+%2845%29.jpg?Expires=1795286768&Signature=f76e5qAX8x8rwTcIpB-R5qYmoRVD5gqvGbWjvDWH9n1Nv0aaGBdbtZG629sFWl9hpzsJhz2qazLIQmvab-tGROceYRS38EHtBss38w3F~e510UGFkG47lTO8smMILe~FiTM6IH5rP68QzZCZ5W3Wsa6rVBvS2DjfA4jb6nQVwITQ2IOha7FU9vUS5LAYtamCK029kvhGtjLXi3jtt9R7nGX5b6ZGLfzy--9i932ZmRGFDl3NjM35sdsIERGnfDA670zFcMZ~3~DTY07ugGTWYKyPiKlPXiHaVwz-zZYEod936Li~LLNIQqh7itQOY4AmXGYkz4Aa9WAvR2wLwqTUeA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 35000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 75
  },
  {
    "id": "sporade-und-250",
    "name": "SPORADE UND",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680727027-SPORADE.UND.jpg?Expires=1795286784&Signature=jo5-ceevYYjolra0oCUrcHoiKjH92Tq1cyFG-Urola8rGBmWYEPZhuc5zFbAM68VA2IRpimHdoW1VVDi-tPXrvBajFnTnSURwaezwck2VyY1F0M8EE~x~RXcIdguJ3WA46-MiNfiVSVwRQzKloFLmGv1RBuzmn9doaE55fRLqbHGmsIBlK-tO9jvZxnzKZcQOKSm0Ss3oY5W8KQRg9SjTUG2IY6P7xU16h10qYDy73ikTLXjU4z0gjoeZaKZcq7Du5JFwOadGQzMdDWiAN9YRvZs4w-EHuAYDva2hPAwX9Ose1Xk25fT9-1TU03~7yO4mcFiaaJ7UBiFbBH2de-QYA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 157,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 75
  },
  {
    "id": "electrolic-84",
    "name": "ELECTROLIC",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674899-descarga+%2836%29.jpg?Expires=1795286766&Signature=SKIji3zyRHLv9QevZXXGlMKeKeZC7P7R6bv9cS5jGxzVcDhFX83PKjeCaPYuuoFJI88Ie0RM1Y4xhIYHCKk3PnIuPlOCipuY6apcpkQUv9Ndxgyv~s8W4rS5nTbT8yqYdttIIPMzwVdN1-R8D9LUd3PJZAEfqrvwI8leVwdaegdzO0ingE322tQbShJTKlixKCvgGJF9ORuzRGU5Ksl7~bUdJ9~7Xdauiq4YDebE4rIeuXd1jVdGdO4~3Lx4dEyJMyDFhwepapMOWbOHQESS4t2if7YU4jHRkTD5HZmfagbJ4oAaBJTXqdikBGpphv~Mq92e8P6feTaFRWB6ct0Pqw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 10000,
    "stock": 29,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 76
  },
  {
    "id": "de-todito-165-79",
    "name": "DE TODITO 165",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674712-descarga+%2832%29.jpg?Expires=1795286765&Signature=AZQhEEHK1m21T8L0JwsBPIlOehrWHfQ62WMMs8nr4AwAMBjswj1sLBl52h5Q1UGh~OHMJGheGW3r-RRI2HvnqRlU6FM8G~cUr4k42zPDSQ3pmmwSI3sO9127iptskSbzyZ1QRAfKL3CF-6ibvXkC~2IHdkU~CMMe7HX4IHiTva2bUL2NPuOP8m3bPQf9U7dhduFV8hOR-fhnYuskrZbwyYPkmwQKzRbnRZry3nKDGoSiWdTXM1q4edQBQEWThIsBeNNyYyTmcvObqHeKovWGOeLYT1u8UK3mCZwKI~oGipDQjVRtV52SKxAmdbvOLQ~aGbtU1j82pkKCYOrdhDd4GQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 8500,
    "stock": 29,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 77
  },
  {
    "id": "de-todito-65g-80",
    "name": "DE TODITO 65G",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674666-descarga+%2831%29.jpg?Expires=1795286765&Signature=oB13jQHUOhs~hdqQ7mJ2jDQawNEM9NwQaXFi0aMvwuW75MwKUoD6NzUGE40GU-uL6XvFzvWkJkegB8iNaBY8qVb09-WYGYpfV3cVzayOp57HNvCgAm09c~4~y9gHQUueeWODcgRUTUQCN6BcXL0kDJ1In6Z-qpqfdopMaKNeIJ7XGNPJ5mpzr4eWctpLBvUaY-RD2gkqYSTAdahbxR8PfN4A0u3vQ1drhXpL8MQu~TTlLBs3lb-v3ECCwdlgEFdrnK2up8nkmJYYVzNV-BdGIpPl3WvEprzw2damyuJfJedxPwXqSA6FzBJ9psJx65q7pkQky8GOehVTw1-bqqHcfg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 5000,
    "stock": 21,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 77
  },
  {
    "id": "cigarrillo-romans-59",
    "name": "CIGARRILLO ROMANS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659672250-descarga+%284%29.jpg?Expires=1795286761&Signature=gxWW7EdI9IHeL2sHezF1ywTkcAvLa9rxsj~aoAWZsqtHzauBczT8Ib8U0lKzfaxkZT0355xxItGZhclb1u~hOpDZucsBXEaYF1Ip2KpnTkwNotLVlZJzWwKqWzFFu0V30ZMrVm6oZ48OtcaWbLHqNInseoFiEVMBWTu5vZ5uFhoZiniPjIH1dS0bjEFQdsL8gRCbb5Y~bOTg9PjJ-gR6qyJ6zMJsSl90F8otBRCqvx63JrhfHOTDrAxWDmdeQ7p~ITJy0y80b5T1tZLwxMxWzXZ1tWxtgtIzdiGyB~O~n0FeoywcIFLJHIuHSm5Q2gFRE14rnsIQgn2RRlVsBeX6Og__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 8000,
    "stock": 28,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 78
  },
  {
    "id": "cigarrillos-luky-60",
    "name": "CIGARRILLOS LUKY",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659672315-descarga+%285%29.jpg?Expires=1795286761&Signature=Qc53qK4-EpFQD~MI6FxSEus1vw7SVXCMRcVqTF35j~tGp~9b1O9ZHhuSLLAEh12NAx058gp7rTAXP2etzrVY~H-UwU7niK6v6dh0xRaikR-7IfuSlABQ4COFfD2ZyP-J0jBbf9KUlsLiVQ49GDreyqXxELRiKGHI7WXgK2R9izpZzGXjT7VYT-BvnjY4pmUD6nElrfGGRu0eu7bsCaE1AdiFzA~j3ndpBIZVnZYZzXrrhzYncnienDDcj86Ro0o~Nb1fLIknaSJmBuyOQCWn1b6~K2f74jyN9CijHzUDujKnP3dp7whxyvyqgsbFxVH7QeCOB95WaF5vgobku0vOiQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 8000,
    "stock": 66,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 78
  },
  {
    "id": "und-luky-351",
    "name": "UND LUKY",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 1000,
    "stock": 75,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 78
  },
  {
    "id": "escencia-vaper-stlth-86",
    "name": "ESCENCIA VAPER STLTH",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675040-descarga+%2838%29.jpg?Expires=1795286766&Signature=T9-eaA7BImJUy6ylicN7eDfoCabj1jnu6zr0IvaeADwFn-A-EL8HUrWeo4eeVfmw4boUWQV6xectVjyH-s9dbj5cTH3ykLRlcGgJEFjIU-YcQ5BPf2fdoXDUAS5mw-dpL1T2~YzUkmbIsbyOlUVjkQW8idBTq-chDAQ8W4NCbpFIZ9bMlRVq2GrDfuvZRCvgthxYlOC66lIIN0i8SDYv7AJft-q4fYuVCvM3DS1TKyTEBLaczxx4QdfsqjdVaRT8KdVm502-kyvMukgQIel0pmS6A-VUZysjqrZHLKg4Ii4ymMCK5a1RMm9r8m6JIIX6ZnmCpOYh-dy9f-L95f5RIA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 15000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "kit-vaper-escencia-stlth-104",
    "name": "KIT VAPER + ESCENCIA STLTH",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676450-descarga+%2859%29.jpg?Expires=1795286773&Signature=eulDN8DSHbM0FdwbNnLm-6BB29HP74~IK4OhyFjx-xPunP7PstyOdIrF93hZiXzAqBC1WsXmgvPtwBaLrHTH-isEFOYcqhkYCmQHWucZzKQtvqbMCVbJyKIlzx7zzzwNaQAugUqjilYxZAlDTEC0mz5vteXlUhbHT8FCyQT-Ly6vfeAICamEA2yY~VOEUb8A3M-0pflH~bgKzRdZaRY7SA3Dvgsf8KQxiCnPcb4RRNMXd3~04kQOYosAiuCcDxxnGtLi0oDHc8SBdhw-pKt9L-MPXpowzIiSA4MDGBNdFwiTIpmvP95s~5ch2CAtTSs~uforZScZR4XVjoB7lYHHGw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 27000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "vaper-15mil-puff-364",
    "name": "VAPER 15MIL PUFF",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 35000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "vaper-30-mil-puff-363",
    "name": "VAPER 30 MIL PUFF",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 50000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "vaper-5mil-puff-365",
    "name": "VAPER 5MIL PUFF",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 25000,
    "stock": 3,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "vaper-airfuzz-20mil-puff-385",
    "name": "VAPER AIRFUZZ 20MIL PUFF",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 70000,
    "stock": 5,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "vaper-elux-18mil-puff-387",
    "name": "VAPER ELUX 18MIL PUFF",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 40000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "vaper-mote-25mil-puff-386",
    "name": "VAPER MOTE 25MIL PUFF",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 70000,
    "stock": 4,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "vaper-rams-bar-30-mil-pff-384",
    "name": "VAPER RAMS BAR 30 MIL PFF",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 70000,
    "stock": 19,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 79
  },
  {
    "id": "aguila-lata-original-x24-185",
    "name": "AGUILA LATA ORIGINAL x24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659664542-descarga+%281%29.jpg?Expires=1795286753&Signature=WhtxSnnQQ1N420qbuV1PQ2dA3t8ReWmSrcgXsCRP-11LdL8t1fWChQzxl~LpNZgBZlgoYEm2pTOFrYYqA5Oi6kkmaQY-XCG2NhFg9XiFz9OO-Mdu7e4KKJUlC45HGGbs0Jef1fz99ojwMAyNoq9qg6i473eo2r3gAdWZAM0HU2qEg-XrftnHnEoWkx7CRznAmeoA9ZhFdZCMlSEkSzYvuU4on3Jl0nXncYklGc1IXCaaJoV0SlmfaHjG8RTkzusEMkoqlOTCP77OZQLXU~tjStCJnaS~-Etj1Oq6EFcgYT0z6WkIGZBuUmt6cM2594~qDF~ZTDdzXK86CUy1HZEKmQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 82000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "aguila-ligth-330-x30-187",
    "name": "AGUILA LIGTH 330 X30",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659665146-descarga+%283%29.jpg?Expires=1795286753&Signature=kfMAS7-45XXZ4kU~AbhR8s-C5qD2i~XpF4kXqgz5k1OZZ~NYG9Du5mtcDTt9SDpuPAczetd~EqsYMOY~MKnIXszyY3GPQBm6HuUBKbGRMG3CXG7iGv3qDDZU7O-i-Q5iOEP8ag~YvUAAgtZ~oChysg5ptUNIJG~wbZLhZKapqa8lGnlJYWXzOSzCjUZAfWXNCDLSOxg40nmPRwLCt-3J~5p~CeDE9KWjg4wx5k2cyCudGRbaNkao~u~WWRrlWP6XrW5vBW4bTUUfODB~yVvC69blyBXG24B~ycN9T70OtpFTnVEQHovA7YfJjcRJ0I9NFIza8w8lczN1-0BLHSdYPg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 78000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "aguila-ligth-lata-269-x24-188",
    "name": "AGUILA LIGTH LATA 269 X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659664920-12.png?Expires=1795286753&Signature=rOvVdXTI96pts1I2pTzHMW0B6MKAo~qH2wa69bSsgfFKlwRx72z1Z5FekPAywgRU9tGU87d2UWUsZ5hhmMg4Wzrr9Q3K2p36bw0Diw4ExCEiw49hrGLzmT1RW3-rF2KWWGDW0BIZISuwbo39V-DSyp9BgkCJnEh27uIFWPKdKEGcsA7hz-DbpnjKeZCY7ThaJYH52XYAVWYhVGCWvyzuT8vVT6pj5O0eMX5sq3r0DIpH-1wncyfVTwsKMY-D-0g9HNnJadw6bCUpVM0gh7YaaIHq3DmIe9kv6t~1Ze0TdEdalMwMAn-oIUGQZ6oSVyDoIaPfGZHuGFPT1GdlQ8th5Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 58000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "aguila-original-330-x30-230",
    "name": "AGUILA ORIGINAL 330 X30",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660146296-descarga+%283%29.jpg?Expires=1795286754&Signature=YU0qq3WrB5NW3DVBinNrzSIgLvscCIb-b5sUa33anHTcqFpM00Hl0kM5sdLQNPTDGq0iaAUjptYfG6fRvSv70FQjp2YBQwgqI-iOqDv-VdyrNxXBcRcjFOXkFe6DWlOTTN4jDPpw72HuJanjWjZ8ky1a0zaxbfBp7RMkJBsc9b32OLsuYY5~3fVfMk~mXj3DpaI~a9YBgSRarDJK51QnkMHC8P8-Tl4P2YHkfRImZK7umESR0XxyKgefjjmJI22pWBVaMArT2VUlIRwWpJgtvaqg2uLDfKdq0U-Etey06yMjcoKLG09MANXwwGsMELU8~gl5qwlJP0~BMZURfJbw2g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 80000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "aguila-original-330-x30-und-332",
    "name": "AGUILA ORIGINAL 330 X30 UND",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 73000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "andina-ligth-g269x24-15",
    "name": "ANDINA LIGTH G269X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659667506-CANLX355-280x225.jpg?Expires=1795286755&Signature=YfObDdSPPkMQcB5moYY6KxEZ00AXj595Khb3v7OEmSw~wJwrdTsRGfLfGACuMTJOY4ohnv1XDn~jfOQQQ3R9pI8k5tUBVs0P9zyMPLUieRoi6XtxG0Ap5BZ8YNxf8lp3EpQ~4biuADNqmyZaeLu4aJbAnqfftfC5iqLaThwO3WQalgI7~UpQdqogoVfKAZcAojwon7geq0l1uGJXJlEnfXHKDx5Z0XmZC3C6f727djXwvg76DZBVUiB5OU05KPaIGYvqzaTTTTLHEnKJfR5AVHfqR0Zlc3QYrixTM1mVM4l~zbscFE3I6aRQTDuTV5wtSU0Ox2v7wiIJDIORG~jG3g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "andina-ligth-lata-237cm-x24-16",
    "name": "ANDINA LIGTH LATA 237CM X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "bahia-light-lata-x24-316",
    "name": "BAHIA LIGHT LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 45000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "becks-botella-x24-193",
    "name": "BECKS BOTELLA x24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669286-images+%283%29.jpg?Expires=1795286757&Signature=eo~gBZScq9CjJZcLUxZ4rKz9DJT8RS4-yDZbXXnUn9WhuVpwhQqj8d-q8UX5A-mQwodev7ygtJrOHxHnT3iYvwvjajv~P6mj9t3Nv9ePUZjjTCHUtArE3H~dDVVcBuzxEIsnakxq28bBTQTKTfgd30G38mRnRANwh6rey8pVba~OT6riaCnZZiakKneXJeaZhGpaFDhguCNKZovN8Ugp54gNwgQ0xjmb8my2Ex~WzSdJfS~u78Hx5~hrJPD2jtiRVXBL4Ebxg316xa-Mdo4pMqeqV~VGu72FfnMolywoDc4-m6va5V3HGbfYHcXgsreYoAzWtr3yGOVShFKp11YGdQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 45000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "budweiser-botella-x24-caja-252",
    "name": "BUDWEISER BOTELLA X24 CAJA",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680728803-BUDWEISER-BOTELLA-250ml-X-24-uds..jpg?Expires=1795286760&Signature=HzDz71POmE~R2fDsiOnLUf7pJYqYNsic1oECXPVAzQ4QxDcAJgdOeFPJzepVAJlk0os0XFhKiZ5eSSih17zMj1oHYRSoXwMaYw9-~C3KR-6tEd4PZbDjRqx0Ikv4t-1fl329RV~eCM2fUUVFBnWER8OYjV4ELOyMpgog3xX6a9syzNKOMZH2smO8h7WH8OwSuwfZuHSlQpGrEUpL8OPN8KJwPWhdDaEJNgfbUXpo2h43uOq4gGanIwr2HDTEgMt3-zzSZIstP-nQb4pVWCt6u8QLY~kMMKuBoHa2D575EY~xOt0lPYwLDEU~QNN1xAMmmM9vYlEniGdCOhcSAaeGDQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 55000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "budweiser-lata-x24-220",
    "name": "BUDWEISER LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659663746-0d5cef048cef53f45b9bd38bbd36fb628f453c72_351718_01.png?Expires=1795286760&Signature=koRGt8iQNdIkbexzBPqG1VSfv5v2iz6jJHGnvtlQG3TtnM5XyQFJ72DwavQDQ7b-fD1DUwXtsugfUC2RaCwt60FM~Q83C~ZyjQS20kcJOvNQPJwivTLiEC1bZtHTmkZsR~7OrhjWRPtyObtS4rMd2oWVLrV34dEHSq3plbhMMFlspeMWNHEZ4kMYdNzIGqGXagLNJ7Ba8DWqAnaMz0-2Pi3X3W2JKFMjhoU4aSUYzdWmoY2I0VEOwLzpG8FWezMC4ptnDT87i5GvTczIvAq3k3iED6Owi6AMAzrGwINexUK4lfpAHwPNbY5B1wAEVbDMBeV1JvCp6W346Q57uuGvOg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 65000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "budweiser-lata-x24-339",
    "name": "BUDWEISER LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 55000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "bush-lata-x24-231",
    "name": "BUSH LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660146413-descarga+%284%29.jpg?Expires=1795286760&Signature=ayuwx6izeBcPkQOtHUcD0oWS95qUSOTKPfJBeZVqe6q6UIOGrKESNFaH2D-tgjxFQJvd5BQV1oA37qK-qnCrT333IyKwr8w80bEqLLR-Pd0jsFWi5FlxN4wGs~2NnZKMhMh4pXsSWm5n06GbJiYJyYUTM2YB~lenjc9AE0a3J-kRhA4XV~l~-kZgZQa0qP39GdevobJvluSZEybP0p1J0I3sSQgzJap7yapnt5Cu4TCbQARt8Rxu4~eAKZZAWuGNTejqB8M-UK8KIH2jrK-rfRPmlfLseBNGKpkdTryGMf4RWEsLUl8AlcVcWJDiPh8zONBviGvYiBMjgoSNcbp0nA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 40000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "club-colombia-330x30-207",
    "name": "CLUB COLOMBIA 330X30",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659672549-images+%281%29.jpg?Expires=1795286761&Signature=UKs4pqB-PZtkbRLwzeGLtl3iCXLbTRaM8N30P6pL2ZBsOslYAEFGs-92zqJLWy6iIUtxyx11wGirh68qQ27RcPp~HsgRIqYK6Bj5XIWcr4gd9YwAL-Sn2~JvdEH-dTP0E3o1ge4CYRgsWBnq7NWUF~OJB7wTl3qrCHFLlQ4OiH2BazH0AWMS5s8SEB0pPEngdltVGSnizIT2RYaBrtpjRCjYBGovXqDng9R5gOW9CMOroda3knKS0Qj6Eznf-1c3Esm0NVn5z~fU~TydxYdVyPNPdP2Ns2sua50oKV3rwhRcCmnC5urOgO3Nd8fZzf5b-aeKmxpe4Hf07blh8UIGBA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 98000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "club-colombia-doblemaltax30-210",
    "name": "CLUB COLOMBIA DOBLEMALTAX30",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1240194/Club-Colombia-Dorada.png",
    "price": 70000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "club-colombia-lata-x24-un-paca-280",
    "name": "CLUB COLOMBIA LATA X24 UN PACA",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680726480-LATA+CLUB+COLOMBIA+DORADA+PACA.jpg?Expires=1795286762&Signature=RtmTeFgLYEBQ5mtoxJdbRWYxrovArcrDXtXbvTjuSrkmLE1W9hXq6PzV10ziBxjS2SzevMRHptiti-sIQWytIX2BpnV76rYuRl4U-yZnslE801BI7jbsboEY3i5ZPkvpL53ap2YsC-UypQ6zrbVnhokFINLDkEfNp4GlHHovu7U02Y1YYxCM5wf5XmM3TMFUfNz3XuSJOuCTrTr75vMSXlwItStF3PE8D3tobCVE77sLoU4FtxbayYzVDvKRJuzCQiD1iG8-6ogb5Mpw1X7hK43wdoFKYLCtUZpCeETSxyW4HHJiwY8tHRYLPw4R02qXx4DKq9Nk~hXve07nO7P30g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 84000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "club-colombia-roja-lata-x24-208",
    "name": "CLUB COLOMBIA ROJA LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680726259-LATA+CLUB+COLOMBIA+ROJA+PACA.jpg?Expires=1795286763&Signature=q0~xPmVUiUwHpY8jOV59b39KK7uEZss6Rb0oCJgutyenEbqfB-~KuMV1DLQZNO0fWTs0vq3K5bSS~ipUtJDfELACaaXKnFkmnjXNxx180Rw2oYsGRbaWq5HAMQ4~S-6kAlianrwIBM9~BPX9-N1UgrJtS5nEsuc38LVI9uj5SOgSRrsQixKoWTLC2~9UY6SQG22IhCKw-wDEs~SPpL~KIS3NP3S9c2v3fkDPCu56PG5PH-0pePydqUGyXUr0ur1uJFMdFx2qM~xxs-Ak8wcIq7fauOp4pMvqkwg0c9rmBPTbqWW-C4KB67SVbX7sBHiquboV6n12STISeEGESoOgqw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 73000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "corona-355-x24-211",
    "name": "CORONA 355 X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673789-images+%285%29.jpg?Expires=1795286763&Signature=QFh3-9xSZWra~OYeMoQo52g4PHSwWqPahd0Pm3-K8426k-w9SMJFwi79AayeERwqP9X1AFM9gZ6asHBuWEXKCeJ9sHnzDToMTYPX2Ng5LpYNA-rCJrPWTcePxgN~D05jvZfDbgnUAqUXhlRLyltK-KtCEDmOyQ6ZPoZkc30pYWlkzKeserB~NCTZaggBN8BCHWD~IUFI4bkkN-iLBM7eR29dZ6XUe7fz4nJEFFlntsd~XyrlbintjOmDeXX~MF8C94jwXqk6L45xNKSETTV~H00VMFPjAGUXttNjw~6mZ0FR~PtuVoS7qRMMvSfgztd24j8J3WUBtSjuSei90v6LHQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 115000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "coronita-250-x24-213",
    "name": "CORONITA 250 X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673969-images+%286%29.jpg?Expires=1795286764&Signature=B66x-4j7CmVrqenFfquP1gauyWVzA~cEHVkeOu-0s8rKSucTJ3eTrgnCDVB3Jtr2ZjQee5-KSFtvO8T3E1viSfpHYdGBqLpZRZE3utWcEkYtl8-Yasi7hibaoay8pPafEdm1lrmxWzTz-hARoX0~2nfkjrxMnhd29ORjbyQi7SSBTsxaVZt~-YEVKN5jjQ67ofahxceScgM8MhP1OBPBXY6oJjiB6lzru5B5K5p93mcwyIT6pqZWoK8gNRqQvRssZf-F2~Zs~~n0Wfe2taqk7VM1MnUDZs~f0KcBrSN764pcHKKAwJaZNyyxH9~kFjDPLhCm-67BFf0W9aoQUvUdtA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 85000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "coronita-x24-343",
    "name": "CORONITA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 75000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "costena-lata-330ml-x24-367",
    "name": "COSTEÑA LATA 330ml x24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 72000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "costena-lata-x24-344",
    "name": "COSTEÑA LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 55000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "costena-latax24-269-ml-217",
    "name": "COSTEÑA LATAX24 269 ml",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674167-descarga+%2827%29.jpg?Expires=1795286764&Signature=FB7aSxYfuE3jqYVZFxJi~qaSUVfFi9qv6xrz30x08O2sj~0ho2qG5AtolfhGDg2UiBnu5HWITTgcdA~7982RgPCT0aZ3Tq5Z9pLBlOLjbajEODk3WsmggNkZDSeH2TVLzXJBRALgS6HYRcp-zBboibmahDXQGYahPC4rU5ynqtS-WciYhA9ilQFaJns-Eym5e8ki2bB5IFnzW8q-OHdgObifsU7oasDP7xgRriJEM5CLykL-b~76zPaYwOnsnX~wAoA5iOp52gz46NN~N10yFENAMJj2Vfp-PwiVeTPQueb88h8PrswPoYw~VaURoTvKFuXzQ~pM8mHzOyxuYd3w5g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 65000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "costena-roja-botella-x30-345",
    "name": "COSTEÑA ROJA BOTELLA X30",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 55000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "costenitax38-219",
    "name": "COSTEÑITAX38",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674579-descarga+%2830%29.jpg?Expires=1795286765&Signature=ZSyrQuNO3zlGFuKJDxpzB1Gp~HHp4rmPFjsspWzhaaTL7hxD5klmrPCq~p7n9B2PDZMyiI~Yt6Jm0b5a43RfNgMJeTZi9WZOM2KYPxKjpyqnDkIX0gNmgaDdrRSdknxGFH6n2ih4h1vDojat8fqY5ohKvtEuck-1bpe3bMLrv9wJhYn8RXiRL5vcjQ8I1DMRkBakGJ9tKpGKOe9SgCGzdmgw-9D45u2i4zYrTa9FgAYYumuxTAmVxmakcBqbbG5BOr-5iKts5YE6TwHEtfR8QY-ZV8ol2RRrRXb9Wr-xEM6l932jbA7qtxmaASsVmsUbL1pEfIzPI6mz9vUiyNMeSQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 82000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "electrolic-caja-x12-und-322",
    "name": "Electrolic caja x12 und",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2433580/7702535011799_0.jpg",
    "price": 84000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "heineken-250-x24-196",
    "name": "HEINEKEN 250 X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675744-descarga+%2851%29.jpg?Expires=1795286769&Signature=eJ7EFWAeHCWL~E0oh-MA4Lp0mNhHS0J07cxeAPGeAmuX-7fQ2tnMn3qMhsJkYVsaA-52kU1OdtblBZwvNz9UjmqfvUPtboH-cSZRHhN8GP2e8~9WO7RT5LWPC80qjuqn2QTU~TJdppuldXtxlY1iFym2I-pmd7FlNzaEcHOToKyUye2CjuY-XGaP34jqvvBd2YcwmO92ZeAtCvBOwq0jfTOPlxNxggFkN6ms2x5De5Tdn1Ty1Gf-wkzIHFl7rlJNAsZ4rW-nUEhPX6lXFS2CK2Pt-ZAB1hsgLJLNoT~fIHFdxhQ4phn7uER52jPZCto5JCbodshwmmbb4c3svZXtTQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 65000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "heineken-330-x24-198",
    "name": "HEINEKEN 330 X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675913-images+%2811%29.jpg?Expires=1795286769&Signature=SKLpU0joHEj828Dkzfz1c7S~1s5qlgf7RShzaR6ncK5U8R9uAUFsV1xu6k2jeOMi8Sq63cQMStLUN7F8MVYAQ1Bxt52hfGeQYkl7FBJGTMxQHoAUz~fpmBfLz4MqnTWj9VAbjHQGSQKu89SI1wp1emm1zIPqoTbIDQp6a2uCuEzF-7nuc4l9GQBFj090X7XSjhdT7DwP~1Z93iaCjXvVswAwPr3AY~IT1KKQ1~hq0g~SP63dMInXSrjG4SOtuPXn0Ngu-n1WhZ1pHIsPQklAGB7~CMT~IEPFgFgER2xURkhbWvq8s5huR2RqqgW2IDr~9vaTQIxv1XKG9Zm7aGXukQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 86000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "heineken-lata-x24-221",
    "name": "HEINEKEN LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660146541-descarga+%286%29.jpg?Expires=1795286770&Signature=JVSRK2FWZ58nBcAlH85AOYwngu~t6iQQ5qZ-UEABdEG93uNTgpj4Q~fmt2uCDGLharr8KbPnqo1ogpXDC8U7S8bMLEVkBZQ0LWmZAOUKdgcLZdwm74eSUXgSGVi9psPef8RRpiBol593vbeNBJ-9Yvr1EPNiqI4lQUvxDT5bdHTdrSbLL9fTS8uwWUB3wuZQIyZPVKDCw5C-Rs7vi65A5fvOea5IeIeVh7IPj7sDqzNJOEGxnxd5XwmfoPjhsJIIcpM-2ULI4Z3IC1oI4xZfYhC1AMl4J0SvmZ6KzPSgeBBzOYyVF1H748ge7NxDmHFMozNLA1k7hcFpqjueFFE1Xg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 68000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "like-caja-x24-328",
    "name": "LIKE CAJA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 120000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "miller-botellax24-340",
    "name": "MILLER BOTELLAX24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 55000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "miller-lite-x24-194",
    "name": "MILLER LITE X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148447-descarga+%2826%29.jpg?Expires=1795286776&Signature=IJJsZVDFzk7P6GUUjffQBWIAqTK8YsKXme~JLqiAqjFomAB1OlQc0tqjexd1R8oO5TclBR5CEespArZ~e7g1tjBmQFe4HaCZINKIccyQGbLUV0gBmuXharX8vtJ6YQWhV~zG7fAEGxVLGBk-FKnTWoDCTd53wQZUNMapKkDsHQnOcB2mCb5oLngouyZ6C78fSvYx9dp78st9NvYuxcOdrbzOx1itqDAt16W5QIEFYFWIwsSIEYrnAG3Gn6RUanZj87Yh4eY5VeruIUmzBjpZqJvpChs1mWMGLiGDrlYL~uBDX~R4mareTY81ovKO4f9liiNsVJyNPc~7Evji9AFn4w__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 60000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "old-parr-1000ml-caja-x12-321",
    "name": "Old Parr 1000ml Caja x12",
    "presentation": "1000 ml · Litro",
    "category": "whisky",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2492092/5000281003160_cd5cdf6c25ec4403ad9ca386feedb1cd.webp",
    "price": 1924300,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "poker-botella-330-x30-342",
    "name": "POKER BOTELLA 330 X30",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 72000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "poker-lata-x24-224",
    "name": "POKER LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680802961-cerveza-poker-lata-24.jpg?Expires=1795286779&Signature=osirCgGkY3itSQAhIlkUrPtG0gu9ULwodBx-8EOdEdpnkXeBzQPJ7qLVk2f8V~cbFqNLCAJ2Bj5n3~JQMDjxEzXLR3b1YdFxc6-IED15w78MR0TzxzPyYXnjuhWeJs74IfAU32J7MWNcIfZIGgZd~2Oy-677Fw6G9ElDldESEzwel9BTwOG2b8RDU2imHKD5yMJ-Uu~8sHQC~pHJA9nuJp38ribVV58xZE-Wjl9O8QCFACc9rtuhs9Q600b2pvZec6TIDUyHHLdrjTv4Q0bYxCEZmhoTLjeram9Sh8Qg0xXvB9807NO6nUghkFJICzJD1tOWH8SRFdINQHzuGcEPZQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 85000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "smirnoff-green-x24-245",
    "name": "SMIRNOFF GREEN X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680890232-909851.jpg?Expires=1795286783&Signature=aOXaFQV1opT-pYDTXTnUKY1YDmdTfIkugwWdYsg20VT-rS0W6oKqOViDr9NBYPSWWqiOBhQMha4EwBlnmwzumK1X7P1fSQ6944yKTwsYYVdzH3-tD6hKoA6UpL-d~6P7hWyUOcbi1CoIAYFepCoPybAmFnO-js9ziYA1vTKRvX0jkLQdIOgyrdycWCjeFeIYXTycpEZkMQdesWNQLSyIj1fpIV8n6L0W3a~8HrJvqBnqdAzehJum3nksj~kfScGWIXd2u0bLGfG2pve7xHjSVUmSUTcNFKj~DguG6xMiM3mqceKCIU8BQwx5e2jutTgtrzznOcb5rkaZKRoKr4yxXQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 195000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "smirnoff-green-x24-al-mayor-246",
    "name": "SMIRNOFF GREEN X24 AL MAYOR",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/642412/7312040017355.jpg",
    "price": 158600,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "smirnoff-ice-red-al-por-mayor-x24-255",
    "name": "SMIRNOFF ICE RED AL POR MAYOR X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/642412/7312040017355.jpg",
    "price": 159000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "smirnoff-ice-red-x24-254",
    "name": "SMIRNOFF ICE RED X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680890115-SMIRNOFF+ICE.x24.jpg?Expires=1795286783&Signature=qumM4MKsyU7RotO7Ie7~pYq~NaQjB-fjJRwl5OpL7L2PzTajL0Tts2Ry4Itimx2gRmXEFhX~7TPH2u5c0GzPUQwJhacpSWS73eqr3n5-mgzv6nddmjicGgBwivfl-u1b13ddFxhimrlUoOuhvSRsZlgKzXAXyp9ebB8ZIKr1EqsKf2Ct3WNhnQNmnmhP3XmqSePy97K0Vm1KC8-Isr71HYIm6QmZ4nwk-Zh6CDBeetZJaQtZnQoZ5uhyV9MN8sdG0lv5j81UbgE9SNuqcofgmi4ujwxbUoUgYn94xg1KVOuZ0DPk-ErGppSyLjoTt3vN2ZgGHB4mqDGTw77QAvchwQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 195000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "soda-bretana-pacax24-202",
    "name": "SODA BRETAÑA PACAX24",
    "presentation": "Paca / Caja",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680806513-descarga+%281%29.jpg?Expires=1795286783&Signature=Goohq6RHPy7UcU791PHJybu~C3nYjIcS~CsTVuCSX38bW3r4rf4gjd4G-1MXxMtBnIUcLNjmSPbJK02OGxjjcGwJyHLnOIWXQIIR9FthUQjT5aksfdxxYtrHWe8o-4PKdKrFkzngfJBe38HTX7JtVqLYtuhBNXm-hrBF23c0Jm30e8~5PJC-xt5VEuouLdMqEoCKN25VSJ7rit9O78wAA3OTR0Xi~ww6feHT02sblgCCQArPGSZfRC~en2EpMUzRAM0psd3ADkN2-22UowFCPpSoRGrX11eATev6M6uUPFEqlV-aF~GPeE~jq2cIuww7ETiCpcw4GTvEDV~PoeJeTQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 44000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "sporade-paca-x12-251",
    "name": "SPORADE PACA X12",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680726942-SPORADE.jpg?Expires=1795286784&Signature=UP4-7lcHVo0ZudGxW-FMr5QPfo6yn8fuFT9mxR98iyFEhbp8pcAeh5a-siNgJS-zOJ2o31zre9hILOiJL0C-oBvVTtjNwWG~cNH9saDDf7cZ-msxUoSlYe~kFJ0u0JoXXuoNLJik8qmAegQADsg7dSacRiZk-dVfD6dIpXAzN7I~wsINH4bKnAg2C0b4SjGWoamkJbfWSKSQCFvDHoQBSmvYg37uKcZLw1nYzV-O8ytKskXCqmiPr~7csT3qsx2A~778XtAIGBEh15a3s2mXu9ganBtNvBAI~WPIhfaUQlGty2fRcjfvORjH6lCvE6-o~usUIRJXNfJOLqBqKMdR~Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 25900,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "stella-botellax24-203",
    "name": "STELLA BOTELLAX24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1686343907-186ff0d3-b290-4adc-a4e5-8669a495548d-lg.jpg?Expires=1795286784&Signature=ZqWywS0Mzu0BeFHKBPPFVL9LfGYRH4YIbiwTJHg-oM-HIRAj~Rop9SnbntljQHSznLDtf2OgWPTh-k~oeFHTLIapPvy0B5STRnP1kv-~EKrGhIorsRWFRKkGrO0O8N1G6n80A7nkeG7LESskwJEYCjr07Cho1wILmg4F7vM7MyGzHcDpjTjCoZrf~m1hfCvjQFzYjqxRsFUQfYH8kVi8IfHhZP-eBI9WIq0V3lbuizNy1Gql7VjG6eHvyEwECRBR0or3vOvIqLiiY6NdYgO55qoQaE4wNmGTwtILdExd0BJWxqEr7udzEb07359iQqhR5H0jSWtv0jjAclCMvclZzQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 110000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "stella-lata-x24-205",
    "name": "STELLA LATA X24",
    "presentation": "Paca / Caja",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680892322-stella+lata+x+24.jpg?Expires=1795286784&Signature=FKMaAzTEw1QWLGqgW7s~bzETGoIAph7PmTsL~ffpXGZXSsieL4UjF1pcp4e5dt3qvwlt6sACpro8y1WOpCTubc3O~VGyZrKRS~9IJxQOvcKmDHprmPTdUB9o8uN9jCziOQZZySUpB7wMRDWv0ivaIRxTpNMJHcqyhcYX31rrYzgDeJERQ1KGEMprkYvjTVZs1vUxBJAC0apWMsjsIoSKBcOMbEJRLyBEL-tax3ZJF3n6JjeX2bnn68LxKWJhUvr30lKjYdMXVcoc830vRf9PccSEoOvRcle6hjECHtbAsmY~pXoACv6caBlCA0j7UgraQ4q58AzJekH0b27PaOKfzA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 87000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 110
  },
  {
    "id": "aguardiente-real-375ml-379",
    "name": "AGUARDIENTE REAL 375ML",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1852397/7702049000531.jpg.jpg",
    "price": 30500,
    "stock": 2,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "aguardiente-real-750-ml-331",
    "name": "AGUARDIENTE REAL 750 ML",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1852397/7702049000531.jpg.jpg",
    "price": 58000,
    "stock": 2,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "aguila-light-330-lata-388",
    "name": "AGUILA LIGHT 330 LATA",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 3500,
    "stock": 34,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "aguila-ligth-330-und-10",
    "name": "AGUILA LIGTH 330 UND",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659664246-AGUILA-LIGHT-479x1024.png?Expires=1795286753&Signature=mnF7Wndh-AYanQKych1W~kRpIu2c5GuucsfliL0USgEZko~PIk6ir5WuouVq5crVIIKI-jlLluojlYFu-Ly01GVT0vLvE~ULfF3fiS-Na0vlvVIFBWQxMADgsvwlwr0mPHZ355~W7pZsGuCUdVj9OcKeThijnHENObe1XRRmoIFGjKs1BCL7P8lvPVkgGO8twng90cY2lRofKkYrbpy~7WNmnN3DI948tZNvch562b8TI14JzPpwS6IYk6AR6on1EbLRZoxiwRor47j5me9NOZe4Fe9-2-hplgHy~DcoWm0v1s3CvID2Ff8zvDPASXKTpb~PpkxQCKa70IvWbQdMng__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 91,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "aguila-original-lata-269ml-353",
    "name": "AGUILA ORIGINAL LATA 269ML",
    "presentation": "269 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 2500,
    "stock": 87,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "antioqueno-2000-ml-17",
    "name": "ANTIOQUEÑO 2000 ML",
    "presentation": "Garrafa",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659667853-aguardiente-antioqueno-sin-azucar.jpg?Expires=1795286755&Signature=QWMFRVEmxWOrFVAd~42R5dY3ei3~FwXAqBPO0SkgmF5pUQ~pnMxo2KwWtrLtPNOhTD0Kv6jNChbfwsUDYYRXVvZ6ROiA17A6k4CB2wiJ9N19PTpF8rRWUCPt16bk8NecMjxH0MST879BgGoqGllO2OrO9IWTk4pwk8YhN2jLviIb0knKlS0CqOJEgZxfWFNow78cIETpfEW6fRfEbTCvZOA6E2mNJJxkdvuZ6SujnAiUZY~1EdwMtxfM-~JeOY5MZ5TKDT0QQMWNPZT7aX1cJQyw1v-QuMNG1TeQveQYfoPfDXZmdB45NeeL4qz681auf8s-xBSr0vV78dVGhmwsaQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 128000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "antioqueno-tapa-azul-botella-litro-277",
    "name": "ANTIOQUEÑO TAPA AZUL BOTELLA LITRO",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680715720-aguardiente+tapa+azul+litro+BOTELLA.jpg?Expires=1795286755&Signature=T~0wZ0K8j1gMP3VlxZaTjRk~EAVB8wscv9aRADN15NmXgacvK3M4OtvOC16AsAlR7Yx2UhmMYQ2ouzrYhaV~960w1Q0g8YWr2ZZwBF6Zb8j3-uX~sIBkT4miaNuf4cESsP84K9sEGSiD5KZNEfqUqb3UyzAu48O2RCv1-6ALFdT1uDvbHu0d2-y6Cr38Awyxt9Z5sCu-YlGdDgGAgY4LFnDA5XIN34EOvaH39tYbuwRlb1Oqi0zCKGklBJkoiwv~Gtad3LErQcu0B0H6Hs52t-1hZ8D~cvsUv5R2glXpqZRpsjCkgOuHCt2wkjuup6td8Z02NxqWBpU4-mmtv8dIIA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 73000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "aspirina-25",
    "name": "ASPIRINA",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668429-7702123006725.jpg?Expires=1795286756&Signature=U8mWr7z24FiR~A5vMPcuK~qKnH1Wzz2m3rgYwAI8E7yX2NmZI9lapfD~i-TQe0nXRy~9x-AxvHLcUHu5fPkvcBs37RLC55JuE2I750s--IFCit8VW5aTd9iZ5SA-DAHdZtIcwF6bOECaz2F7ggjMeGBjrW9leaZj-0KYBzBGF4G8OZkh-MxARsVE-9fzLF4z97p0EPdzJkMxc9XAaUkrhfjSDtUIQlE566hYQBWhvfHtBRe2Z3GRDfUSGOkF~Zz2zf00Gnp-4mNgkKnZoTvHyT2O49~wQgXGfgpmsQ1KDLLCy~6iCmhiD1wCWxEOhH0fQb2USjtx4vQ6dBvG9kL4lw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 1800,
    "stock": 15,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "baileys-30",
    "name": "BAILEYS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668723-descarga+%2813%29.jpg?Expires=1795286757&Signature=DeKmZ-0siYpfSamzc5W4-YUAwGSIJhsuumC7N0MtGc5cwOvmt5KpD0pS-jFd6gxAXCKwBCe391K-mtvLwXonW6TzdI4HbvstlDI88EGEuZu5SVjcz6lkHRe8fGeN9eExlb53T8~6CXM6HNfIwGCOKiO7F0ZsJmmGQMoPYIM018zeJl6QfjLjKrDr6hyIaaG8cs1dnVtqDM35yXetWelM-d8yCzGXGyV7Zsjpv7YDDyyEdiPB83TLvtCSzvoFTVwTcSpYXn8z7MD1IqC0Db9kg6uHac~gb8MGzkDsaQ0TUzRtYyBSEwE44jO3-76k5~oWJaSHtC9hnH6LSwP1MDxyXA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 80000,
    "stock": 3,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "balantine-750-31",
    "name": "BALANTINE 750",
    "presentation": "750 ml",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668933-descarga+%2814%29.jpg?Expires=1795286757&Signature=pOjae~dSNyHLEj2GnEDkwYxuQeIgZcMBtYENlMBjQ5-eto0M-Jj0wlO68X0TDdZVr-tkT0WNE4qIjurcw-j4hw3Q6~F9yYGD8wRob7eG52m60neE9IVhvnjxWVri6NSa8Y26SJ19xIvm~Krs49A6g3RXafz7DxzEb34Ab7tQKatCfoK7tsExkFZnigzzpXxxyetcBZdSNdJVwZ4NOMU-tmYHpOk5w-dCx4JsADK8kNr9cPdmUmbMM2LFnvI3BsrFfc4BZqm5jIvx~yJoHhavjQGfDBAm0~OsYK1pnJb0m3oJUcW3k86pJTYYkOS7HPmBADqNrGz7C0xpZeTzrnIp2g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 115000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "bateria-brass-383",
    "name": "BATERIA BRASS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 40000,
    "stock": 19,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "bbc-fourpack-192",
    "name": "BBC FOURPACK",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669022-descarga+%2815%29.jpg?Expires=1795286757&Signature=dFJpixSJOuEuFMQgC6o2l-vt2BscDn01u6tvO9k4l5~F53JNuuOXjfLc-Hd~VBp~QuQNK83EY7JJ4RdU8QQF0PgKNc-i1x-VM69uewub~ZUO4bSMWLnaUaGx2q8~-FSa09drVi9~pv9OxZ4TqEsvjc-yU~jvc8du6ayQFOwa0NHM-LkZ1UIb8fjI0k8l5d7-DUktYUovm6Q9pCEDzDtLScPhl8B5FhYjYwJ6KAKASrqRbrPLuuoAjiYJLZDNgZDy3lx44rBhIR7-0tw6L0yeUAKH0L4Cgx-iqGHftjFo6lQ~M6oIO3VXEBhj6Xo2NpLgG1OLIiT7tcSvbYEj3Rh0Lw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 15000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "bom-bom-282",
    "name": "BOM-BOM",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2433580/7702535011799_0.jpg",
    "price": 1000,
    "stock": 12,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "bond-fiest-39",
    "name": "BOND FIEST",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659670199-7702057841256.jpg?Expires=1795286758&Signature=fv4XvkVHeWvO0B8dUQ58FGbL-d1RBaxziTCPxEWLObDr8l9mv7UrplAQ5ECtQMjD0HH9Zb0ukuS8OAexCAKAbOYyi8yOV9vrK~fyvWtyFoGj5HKPn73PYhwEse7YvnFzwmnIZ0XjQU-HvPcWZlUDJLv19X2nH4IEP25T~~DCfwH3k4EbkzRNqUbWAwRHQxmzNh-zPN2yrJGGqeQkV3S-BKlJLbFQiCAfjt-No4QKhM4ZOUho0s-SZGOdVGulGUSswzn4ICtvoPb2ovkTBreXUjEs7H0TBBQmREr1Q3QlwlsaRyTvWuPiOXISseUmzf0fexU5sPOfbHHx~uks9i9NFA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 5000,
    "stock": 35,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "brandy-5-estrellas-247",
    "name": "BRANDY 5 ESTRELLAS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 39000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "buchana-18-anos-750-41",
    "name": "BUCHANA 18 AÑOS 750",
    "presentation": "750 ml",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676708-descarga+%281%29.jpg?Expires=1795286758&Signature=NY75Sw5YF~B0hwxMmlBQovPmko88k~6kwkBbOkFXf12Qk6iZ89OmINlS0NmuiUzEdPXjDJs3JebWmPlVMQVYCUUZBmCVnpgVoGlqyjS9dJ0xHmWr7-g~DKa8bloS7y3fP6qmXpaI0NOK9C1owqdA9zJ13-omCMzyl6LSaB~4z4eww-Akl08sphSBJE-ZCFkz7A0M2~Ue7Z0wsuLieCDs0xFRNtw9OrlQpt~oyvpcjzqGFia4Sx55AXi5xWimQOc3ntf0GvCLYIKSCbD4XPWLRYfIb2ck6qlSgQIX~ezm-Mr4sck2wQ2bxCI90wrzAXJSflmeMUcS9HPZSc94Dov0NA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 420000,
    "stock": 8,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "buchana-master-1000-ml-44",
    "name": "BUCHANA MASTER 1000 ML",
    "presentation": "1000 ml · Litro",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659670617-descarga+%2829%29.jpg?Expires=1795286758&Signature=hHDh1SvfrCio3JWIMvsecn~bJPQlWbTxGBx016zB7gAPyE23c7274hJBHjPedUawwUKJ4Mgwq2Sbv9nMghzMyzn9OmbrHRnCjBopIT1Vj7njrRc14FDLEAIcFMOvraG8CAYT-XvLCPgRWj2R~kYae6NAOSkWPAxQ9L43awShrYMohaXUAPXAyX8k3qobU6Ay-acnZXwnlWAccHLTa7WSdsAtxDBNq1Oz3BJh3gy3K2bhYmQDcYY-ThZFKttBw~k-U3DxztFnoom-Pi8YAlJcT8YrCZ8mffM4e5kPkXX83mu7xUsVtC0vXomsPIGxI89HPQHCDulHYvNDoB8zwgzp8g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 275000,
    "stock": 5,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "buchanans-deluxe-12-anos-200ml-390",
    "name": "BUCHANANS DELUXE 12 AÑOS 200ML",
    "presentation": "Unidad",
    "category": "whisky",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2491968/50196388_0_14bead8550d247018c4d7aa5728fc4c6.webp",
    "price": 60000,
    "stock": 5,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "buchanna-two-soul-266",
    "name": "BUCHANNA TWO SOUL",
    "presentation": "Unidad",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680728627-descarga.jpg?Expires=1795286759&Signature=obNfYlCot65aLafZhPXw7HO83vPG6kZl9hiNXJGFXrhp32PkSAxyZD7apGtRqqXOCilJ6JdguGHiXjTBCXNFAMDDo76A3ykE7HAO9Yjy2-7fdmNB2eGCCYsfdYH8ScM34~Xg4c36sJ953sPpUCFgUpLXoth5sV2wLsqGZbv2Q4sNErR13ckfOZ12LuVuEKVOjr9Dt-2sWGW9XqBkgsPCccCSaokHej4l8eMA3N75hBnGj1Jx2KPIcFF1oMF5pMKhI~09oxEe6OrmWjlFoWmkWpFuXvf-24MhejVPmHnvk~PQThODSvLZU9bJwJGwd4cfnXAOce3OzuXkwS7Awf-S9A__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 200000,
    "stock": 4,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "capsulas-importadas-382",
    "name": "CAPSULAS IMPORTADAS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 70000,
    "stock": 13,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "capsulas-nacionales-381",
    "name": "CAPSULAS NACIONALES",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 50000,
    "stock": 5,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "chicharron-pequeno-15g-50",
    "name": "CHICHARRON PEQUEÑO 15G",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659671202-descarga+%2835%29.jpg?Expires=1795286760&Signature=pN2fLzY0tD6ic2fgW2fWWSfZ0Ul~TbuB1Le6VSW2L~M0rVozU-zNzIwiaZSdNcrfAXfTtQ6~arjLMo8-lf4XYevTtwe-4r9JeeIknJBVEro1Dh-88oXlgUOeLP8rznoWuiNZIqFzvKTrnwBnPSucV81HD~fAKsEybXqFEomudVW1BqzAaeTvXyytaPENEjoEEZjRcGZ5jNeYGizoQAJs86N3v8Vtz0xdsOIw8VTysOIKRtheIMiWIU~eMKJm-ALxEEM5cmz35U21D2ADb2Gg4HDss99jwNrP22fwrpsmDN9slqU-ocWqjGfmhz-FYvAroMgb3jKh9tTg2HfJH1SSMw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3500,
    "stock": 14,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "chiclets-adams-51",
    "name": "CHICLETS ADAMS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659671267-images+%286%29.jpg?Expires=1795286760&Signature=afZJ~a5Z07pYpMTredcOy7zEKnoa1SKGh~lThEK6YVId3Xgc3FJdTSdZj4eF~dKDvrz7U1~HJERp6L~yRkgu6UxXPjP7D1Lj9SPJuECltiVmB7fm~SVcKOr6e0YsiMaaPdqfzse71TI8vH8qCiwPKFUiiVoPy~mY1Q5Ym4icPl~uXHmPR52B21JEPf9l35~6lCPUPqhkXnBaO0Av37-nARpsDDQQLlKG9gkmMAfEujXjosOqF2-~l58zvLRC8P~UThAdpzfiomg1h-So4Gjt7J-5oki27ufxC55iizzNHVsEZNFCMfeQ4lcn4lV1D3Uae1~HxtqAmSS5FW06FzA4uw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 500,
    "stock": 11,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "club-colombia-dorada-lata-und-279",
    "name": "CLUB COLOMBIA DORADA LATA UND",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680717149-LATA+CLUB+COLOMBIA+DORADA.jpg?Expires=1795286762&Signature=pO1BLQ9Ag9fzag75jR8zpPlqlCIsSgUAJbyKIJlrz1Z4okiekeImhQRz59jN-UrJRIJ0ZFkB1Ws3Wy44R7L3yHsjha9GT2Yy9MLYrVgZ1nUom6rJazUOiuMj~TMwynqFKNbVYSGDmqsvmqDdoq1cWXgHgMtdqX4FY2S1tsvJ97On2~6SuHvGv3rUmtQEIsGoITVyYezF~IgOdP8gmF2SbqN-yCEfTSxNO9a8eaMi90gqC6VnzcabiZnu2TEURxwWdhFLwMuC7ChxOidIaR6fp0wCbyXl7KSxqPtw6mVoiopiGg14n8TShIlR9fd9yATdjF-yd15UZyZNEYhZFGv1Lg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 4000,
    "stock": 157,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "cola-y-pola-lata-305",
    "name": "COLA Y POLA LATA",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 3500,
    "stock": 34,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "doble-sello-negro-700-81",
    "name": "DOBLE SELLO NEGRO 700",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674772-descarga+%2833%29.jpg?Expires=1795286765&Signature=j1cktfRyb~TiCIbxLBWYkUQpGi-8BXrNXPDOu8Fgx7QkWYWZckWXRFT3N4m81XzFZWKsuP66KprTEZekEO0l3y9qbKffxg4v0oWPIq495h~Q9DTterkFa9BfzW1jfiOif2sPJmmFIQsTl-NRLNW0GO5wq0RftHlg2TYY3MOp6BMgVZ~BCqXYB57iIpOCte0bixvgrqp93GPoEroDohs6APrmBGZmkojZkpWcCYdXIgn6dnWqVYNwUPDu3fBdPoCx~DTfdHu7ahPufXRCbspakviPSfnDydy7S7X5j5lPjVtjFrsqdep11-ApeGQ5xhjTNmYF8-k6YbYVue4gEK5SWw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 180000,
    "stock": 5,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "dolex-forte-359",
    "name": "DOLEX FORTE",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "encendedor-85",
    "name": "ENCENDEDOR",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674946-descarga+%2837%29.jpg?Expires=1795286766&Signature=hizwo2BwY6dM59FBCNZEIIIm45rtJVBfA6P3ZZIj-oe9qVFdBcDSUTIJ4zH5DiT3lE90RKqEDweljayFxfjegikMcfXThWB4bNu9lFb8S5No3L9Q-xX9r3dV1Qht9at7vl-OGLwibsP-KSJD5uDx9xldg6~HN0qqY9dUOcQghgxPHA-kkSeRA2yODKgYCXJwKGcolgySU2A-Q3c0nOfKZeWERlKB8nMCxUeAYGerYaF0BhZFdiKWBOXCOdmng7qKeWPNJJfRVHgg0KwzJlb8c3aXNP0eHFafgpy65MgZboKQ2L2GIOlYZ6wdZAnRc9Oueeq4z311dgCuNFWYkKgP0w__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 1000,
    "stock": 38,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "four-loko-90",
    "name": "FOUR LOKO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675358-descarga+%2842%29.jpg?Expires=1795286767&Signature=Pc-WNHd8T-JZK~wnqM74pGf5ATYb7OM5w14MW6~qU63~GwMsXH2DDVb3fDdlwqWz0lQQcn5iT7yAhPKHRzkQCLueXhejuAyGtKOWV2GgEPF7x8ajkQUnL7zSz1BJIukac807CRhT6s9iA2TMR96WtfkEUr3vsCigJ6qgqAHWh5he~vHCJWQeE1f~owwMCAiJIHNqwLcEQlF3wMBiUwXmG4DJxQ3o6eTey7v~b~YKU4jGTYcDbpjdD5yAVGeFD31m1FqkZ0HrLqKj04v4Qhggshiqne0tp3xoy4c1-YmtQ52zBS8CLfEbahGmY9fqfSXr-ZzlFCDzY7kq2Pb6sCwIqg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 20000,
    "stock": 3,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "gomas-bitez-2000mg-380",
    "name": "GOMAS BITEZ 2000MG",
    "presentation": "Garrafa",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 25000,
    "stock": 59,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "haig-club-packts-200ml-304",
    "name": "HAIG CLUB PACKTS 200ML",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 25000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "halls-94",
    "name": "HALLS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675512-descarga+%2846%29.jpg?Expires=1795286768&Signature=mipYOs~ghlxCoZS-IWqUUmogbrutntpezzBvcX77zEuKs475TZ2e2tStaclMKKDJSlRGi7-WcSO4FrDWqHmitm~n1TtzHM9FOUov5mqZPfLY0hYN8D1vkJn3YXmIn397~el67~aS~KhBmp3dQnSPc9EVhT0EnumBEfMR1DqH2tqt9OK-IiMfquH8nbdmTwCSUxGpa~IsodY-Vv1JnP4HVPUV5lKrItXz9WQjFFBXNXYNS~VfCNdXR2Agha3fDnLezChdCnSu3I11y7x7lXub0kc41upP44GBOmqKW7G-kEun2x2qiyuh6KKNaaMUpruSZjNZZaWF~DP~QpfREN5QoQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "heineken-lata-und-98",
    "name": "HEINEKEN LATA UND",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675769-descarga+%2850%29.jpg?Expires=1795286770&Signature=TDFSSJ7JN~0GTmKzCzZ-Y7flQZUvxWvNJiArB-aCwFIRHSEchPIvVNu1X062LsxW0p35whR9ojNTApnwVjd5OPPl9i1jMP1Ddo8kqWIlxo4eindXNAgKiKw6k5WSg43O5ERAyp-rjTIFAcwV0jr2pEROaEXZKZQE6u2wgqibU1Oy6AniDtf1AArdHelx8YoJ~mJZ5wXGg9V6FM7FRAABpaRZkK06Fm-DZLRPwaPFIU3MQ~k~ZYU6xPvLpZ4T7rNkRG6U1O9eNyvJEXWHEstqj51z4kZp4b0zlzXi3yKFfe7CIE~oktpHfprIkprcC5B-3-slU4n4rN2cx2iI-e2DtA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 26,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "licor-de-ron-medellin-750-361",
    "name": "LICOR DE RON MEDELLIN 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853195/7702049101207.jpg.jpg",
    "price": 49000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "like-314",
    "name": "LIKE",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1698362658-IMG_20230721_120346_892.jpg?Expires=1795286773&Signature=YRX04WzpSnz7MjIjXHeOz52WPmWUWnKVZvEFU5iwOfGSL7bBUocFwi-CCI9SymflGgb-KTqLQkhAmiGdf3Ik5E4N1dqDkcXFyas4qbDGNVMOeLgQTOKtO7HpmoYMHJz7KqDgdXUhu15BG84wDPv4-SvJDZ3EHnHvwfjSRgtR1csGm8Z8TeFvjOa~6OXmyAaQd2kXI79avPE760TNwU5Nj-ZP7pW-guYu7m2eAzprgWxQKwz3F89wrMaK-p~ssR1iujvCTqENC~1A7pGxaMqBO50BL~lu8AdYJQpDWeHrLHZ1Bi-3rr-~koL1Cd9vFRSAhc3FNPDQV-5MB9gWRPS62w__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 6000,
    "stock": 49,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "mani-con-pasas-372",
    "name": "MANI CON PASAS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2433580/7702535011799_0.jpg",
    "price": 3000,
    "stock": 36,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "medellin-3-anos-750-118",
    "name": "MEDELLIN 3 AÑOS 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148078-descarga+%2820%29.jpg?Expires=1795286774&Signature=eevSbiIz5zqM4T7USJqtCqo5d3XlXe0lyUFpqdJaXURkwP6CVknS7WzmrFPBfNKmgG8S3gmne~w5xaeS13QsmylZtsLKiaQnRySM3p2VGSYsiIjkUo0BQ1DUOxLINqBpmzaqSJ2w7ssVd2eL0k3ZO-VFKxcI-2tGkWgejknIz1zfOLK97Imscc3v3pQu1eYoKFt0BdrQtI6Age57G~bm9PQFO~bG5Sy-LLtI1iW6w2RmogyuMu-~UJeLAG~fdbuHcmWKsbBMLg4W-HbDL71XEXhPuG1kt3Ttj~z9TMTELBXwj3tYqJXtDPWnjWhfbRwfy4yGyTEWw~NJivE0M-8BuQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 64000,
    "stock": 6,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "medellin-3-anos-litro-120",
    "name": "MEDELLIN 3 AÑOS LITRO",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148227-descarga+%2822%29.jpg?Expires=1795286775&Signature=faOOY6V8YNQKsdz10YnLPzCywrPOdKhfCaIeqK~ir3IpnSZzFxK28xFTZk5YuIrgB3lu5XKKq~wyg3fwnICCRuZTTLCuPINLJu9mWUy2GeLWvkLLd9WTKWKDh4P0-gxa649J6pY4CX4FmyKO~L~1hi9hg4nPdaqoQsdGlQLs~Q1O16LGBwV8dPkVFL-mrupQrpz60S6hMcVrL-R~0FRMfgu5Ea3HJy518jUYNBf3sYD~tc2H2EL2o8RfOTJ4Hev6x0e8a~dUJjtdWO8q3pU-whpysd8IVEOJBHm0RXQAiPZwjwi0-KtOBGOyU5TP7flSnRV-G6OxDYA2RcyJNns9Bw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 75000,
    "stock": 3,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "nativa-330-und-349",
    "name": "NATIVA 330 UND",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 2000,
    "stock": 225,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "papitas-128",
    "name": "PAPITAS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2433580/7702535011799_0.jpg",
    "price": 3500,
    "stock": 16,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "poker-lata-269-ml-306",
    "name": "POKER LATA 269 ML",
    "presentation": "269 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1688264058-cerveza-poker-lata-473-ml.jpg?Expires=1795286779&Signature=BhvYTyMM2Crzn-muilZ-89pjluU3QxY67BZkgN4nLij35PiL5phpW2MVi4fbqd4vmWxtLXTINRp4YCIv4UqIhlfWKhslQMh3s5jhX5UhSx2nccaMqC2iN6BaVaOBwb7Y6tzCjTKAMP3nfb9gxgbSEZdN1o9a36lvLaL98dc~BmObZf5PKGSbI0Tq0xid2oWtYT6lHvs8vfsITJUTr2hJD3QkS61tQRZvaOueGMvAXmJw6psT0Mqc48zQ7DlR5DVu3KJ3HL2PFr2~5ZFNZHW9KZnR2z9JUcz1j-mnZAuOTHchvmcAewP~g7LgfsgM0AtPAUYPH-rsFMS947Kh29EA~Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 15,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "redbull-139",
    "name": "REDBULL",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680805287-REDBULL.jpg?Expires=1795286779&Signature=dYrj2jPw4GgNRXeZQVaqlolLasUMYGwoE7f8ArHD1cX0hiWWzaWT~-2koTmDuah51SoIm3c5WLIVtSAfUobkNoUqgx-zVbSZ5myuLtXAWgJ5dHVtr0h7bxGdbZVNOy59dyKn9ZRLbly0BkkgDWxYv8Pv1YxP9mnhCQOeRT0EgxvsfHmK-VSij1~ZOpkuaBJBAwrcrDp7wior3d7VqR3WCjG1DTDcVgZD0U6FFwY6juj5UWZF9XYqjXQdx1CTpt8NycK9zh3b9CzJavR2qhMNHe11HIuNTxW6jYMp4VZMTE65RCdQ92R1jE-3Q~zjC~MY50hZCm4E6I7hvbDe1WFniA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 7000,
    "stock": 18,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sello-negro-1000-151",
    "name": "SELLO NEGRO 1000",
    "presentation": "1000 ml · Litro",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680731954-1491050398.jpg?Expires=1795286781&Signature=U~jj8R~2dAkhb6kF8ALmV~bs49PnN1plG59L0lTSC2nBZrDdiBAEGAKrJfonRU0JotbN4A7d9pAjxW9PxnGR0WDGdIHoNHbu-RunlvHwcStby1nPhYp2RfS3I2GqSfz~k020kn2q4MCRpTQuwMnXJBVDvl2yLPKQJV0U6vuPX04Fdck5FPXau7~XN0vsCYqxgtE6PQYxKX6H2qcA2rHCiw5qjCESps9S6CU8IocK8HK7u1DeCXN02Jj~6Iezdq7y0j1wD3pxz9VQzzbCOqTisXNK8qhLGycecbKtDavSCPKJSkpcxZ2zaTLByO4vmnkP4VfxD8XL5AeXvameAyKftw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 190000,
    "stock": 4,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sello-negro-700-152",
    "name": "SELLO NEGRO 700",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680732064-D_NQ_NP_912012-MCO43785503114_102020-O.jpg?Expires=1795286781&Signature=gN97Me0MOBvu6SR8Z39FgaM~k20UALk0ULX7R1ZbpIrsdpQEWVcsn~VG2jeAQOKPQ9U8caAY1JC0ZHo5vLx43FeykLHbmTjrQrmZiEyj8jpjnhNhm3Mev5HFANBEJgET6KA0WdKVz7ujWTX2uqrXXfbaOPw1CyySmXiRYu11p0yL1vk4-MN9X9Pxc7Wm~-TuTAuuWC6PGGvSHkeEVF0TQCdv0hX6CSlHRwvFA5vjtGGVf2qSCCJeOKgpTzbWoLxKZCEOoUI-ZZnXrBSTy6MWgBYAJ2EpLa6VZOsLrfo1V2FbpFNeCuc0jtEK7nH1-YmkHfDhoj5W6vywpB67YatLgQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 165000,
    "stock": 4,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sello-rojo-1000ml-153",
    "name": "SELLO ROJO 1000ML",
    "presentation": "1000 ml · Litro",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680731744-20.LT-SELLO-ROJO-1000.jpg?Expires=1795286781&Signature=f4YFpXd4Y9B0x2zRofbkjwoL-6dITABOy1ijnBMpX2UStXiH5SIJpguDT5EGnhn1GAAhlrweN5xLi8wnfh2~-DoYh1kaIdhbWXe9mHKuBb2HkwYWvnsmq-lD8SxXHFaNH-m0p6~clpDhJlPWgutY9Fb81X2rYenXvpTHlKynF~Hnnlvb8sCR2fdpCTAvuP1L06LAsBtFwPJdrhMz98-H2KAqTUsr98uqCphz4JUpmTug2tDIgpVBt3i66NMqfb7x7OXFrGetz37I5Az1UlUbcvmoIuhWcokXaSHxmSEgU1JfDuon6sAh6DXjz1ffueQ4cvD~m3~O5y46dGUW4kLFcA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 105000,
    "stock": 6,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sello-rojo-750ml-154",
    "name": "SELLO ROJO 750ML",
    "presentation": "750 ml",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680731895-19.LT-SELLO-ROJO.jpg?Expires=1795286782&Signature=nL6Kuen4ds1dAgTvZsh6ny~7J85aGsta5xU3eTS6pLKIPxc-plegyGdx594gHnmQWxlkbY~0Ud5UelYbTEqaeatGQo3lWeygCrRQ0hpByXRAbwyfWoOlijWE3alWlv0r~jz0559BUDnyFKufsuH0Cs8hDuRoqGR-b2COCR61SvGQdeK5yB9cf0Fz15DjT10sIlHeQPXaQPzQncsvIczspJskoLgU9~NGfZD7uQD1gEx-EHx7m5QfuoM~TVVu3GtuHVmPHbd5vOoxpY7nS00I2p9Iabucg6pdM99cIuzTG3NsofNv04a51MNY1aDiA8XpGmT5vub4n4ns-QcWi1wGrg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 85000,
    "stock": 8,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-aguila-lata-269ml-if-360",
    "name": "SIXPACK AGUILA LATA 269ML IF",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 18000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-aguila-ligth-lata-269-189",
    "name": "SIXPACK AGUILA LIGTH LATA 269",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659664472-descarga.jpg?Expires=1795286782&Signature=JZqHlUupqNVPXFQ~ApTsMjfYycThH3Emzn2YQJhJ0mcDYotSxiKJfaO86WTzxyaA4j1hT2vRc3SZRFm1rRZ2cepAITNQ9A5Tmg09mkz~4isFDL1nCw~Q1NiAh9~s-2OTJZAZ7Zh8S54NaS2K~kxieFjhHFmJ0fRO~I2OAukZwXfTbt1jRRuyKVec1C4UAFEFkZ2~KxqlpCbAlGvS1mutIGi~sULWvymdY5eeq7pCgwTIB4SdHrJygOycPmZKmU9MvjVEZPPdrgsIp6gkANXOselDPpyaJjlTcOqCB1nXpBJxC29-pi~duo33ydmQLDQUrWhfyLK-ZXraAd1J1UzLAQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 15000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-budweiser-lata-310",
    "name": "SIXPACK BUDWEISER LATA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1688600774-7702004110619_30.jpg?Expires=1795286782&Signature=m9Xxydw5e5almrngxGy73j6TWNYc5Ge7vzpBzt52ggUinmLxGGtaV9kACSP53UVNUCRyFCwpr2b-A5RYSCwu3-2xwhf8d5tT8giQEDM6lIeMoFYdiLNlG5vz~Q5VSHwRkn~BSl0Bqd1CM-WRhhsFrgUPjMqgMtjN-B81Ku9h7BglJ-O-c4hwDvdXGUIQ4MTB9hMQF~x58B45Elw2dl3pJH-OsIh7nfrAZ-109r1ysNwd1SjLkaxNKYWdnHx65-cfuISdQnXWKhEVGjkPsZOjclHP67SHhHYL9sLAENBUAoGOnOpaLPquDVi5VrOXOj~WAjDzcal6ChKK9wDJI5R7Iw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 18000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-club-colombia-roja-lata-209",
    "name": "SIXPACK CLUB COLOMBIA ROJA LATA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673148-descarga+%2812%29.jpg?Expires=1795286782&Signature=DM~rttzW7rmQj2H238NtHtpKSgqV0pPcnW5td-zqkQidbHQyp3JfTihGbGl0mDz5Cj-voCWd6Oe5xbn0-LGjU7Hnh5CXbgrlKc~4~8hS7tHl-GR6p0ps9FaHczou6OEgD5ylFnoW1RcEeEU6v65NvvKkLvW7iN4mYGW7rywnObYVZwe1hIvq4Ne~UFdDg~asnt~QoeQ6pY~HStnDOs8lKaKXX066GVgoNInJfwYsv5Go9WdeXwB6UZo3hIQ1EQ7Uy8o6-Ky~0DBXWlWEivBhFkMbkA15LDV85kXJElyQnj87AYtkm8hymFtH0NP2iijcB2sndo0TJ5ZCceeTPF3Fvw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 19500,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-cola-y-pola-347",
    "name": "SIXPACK COLA Y POLA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 15000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-corona-355-212",
    "name": "SIXPACK CORONA 355",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680727749-cerveza-corona-x-355-ml-x-6un.jpg?Expires=1795286782&Signature=QDzTs-XnObaTx-GxolNM~VfZNJF3LUmLvA-ifJj9DEeUiTJ0VyyCx95ppJia29BDgsh~pdUzt51yUsOpNtcnW8B79UE8PrpCjXKmoDuXjkSdhaGyiHUOB4lNXyMf6oK1jQEzfccl7INKqS9bRF~xzPritSMLHgfZbfcnpdN1n29-b4iXQugc-CvGv~pLpUEhyqmjM5m2dVhOnxVaT0ep7GHj4XAchH4MdLDUX8vM9xYStS-6VKFMjt4e5DDDmY~8l15VMSYBzVr4hIkKgBI8lv0c2PA7lpJJwPf1iO7uoaAyTWIAU05G6nnio1ZMXxOY8N6cKG2IVOLqgXm~SosCrg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 29000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-costena-lata-330ml-368",
    "name": "SIXPACK COSTEÑA LATA 330ML",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 20000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-poker-269-ml-307",
    "name": "SIXPACK POKER 269 ML",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1688263972-cerveza-poker-amarilla-x-6-unidades-lata-x-473-ml.jpg?Expires=1795286782&Signature=gb~tik8oqxKaewOWS3l6jmNvPLla1E2ADEv1c0d4JWxESbu~fXwF92UEJ0INS25~Yn6ANUi0WMv5wrVcmqovX8rUjBAN1LKwvcicDzmosjx4XKBdEpthx0SqfKHEZvEMX~gs5r0~lmi0cvg7mMPcyR8vCwfG2RtzWnXYY1p-KU5JTM~ijzKsgMbf5FNeSTV3b7OiMhZ4SLHPT4~jkE9IWXswRoz~5sqEW~2CDr7brPnTwyRdxFz3dKPDO7AiHvvti0zRX6enCXGaisaMZ8GfVsXDGLFN5~OHxbQIW3C4qbfHQ1FM-Te8QER0xvYa8jFI0g3DHoHYliP12NM4RAYqxg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 18000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "sixpack-poker-269-santa-ana-355",
    "name": "SIXPACK POKER 269 SANTA ANA",
    "presentation": "Six Pack",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 15000,
    "stock": 25,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "smirnoff-green-apple-und-156",
    "name": "SMIRNOFF GREEN APPLE UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680731289-images.jpg?Expires=1795286783&Signature=I5U~3MA-LCJL0HMSS5suQuIrOZUInn2gjSEBy4iy5A-kKNhxvxXyPQhSBaRhhWVI1D1cjGOVT4mA4DcGNDQHfbGtTg3Zhv0rc2mOngoSLzn-530mfTQUNaExLAd7ZE4Sg7SmJLSzMqBLCxttmotD~O8wfiOqKNsG5DcvZIqEI3FP99meJSFWricCdlNOvX0t3f2aOTe3B1mIfDcOmX1bIDTIVthU03JoQ6klF0qTyiKrNmfAj2N8zjXh2mzlW83kWznncQFznUknRKctbj9I5Cx40~oG1CO6w46qMFtANf0iFnrXY~CdBvJDzWWOG35OkOOXbMR1Jz7PtwfC7Q85BQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 9000,
    "stock": 26,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "smirnoff-ice-original-und-157",
    "name": "SMIRNOFF ICE ORIGINAL UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680731030-SMIRNOFF+ICE.jpg?Expires=1795286783&Signature=L4Y1c06V0GZoOSwOkxZeUbf6N~945JgkuuKq18~3-fuXE7cihTBtaCslqdEdMlRkjUCjl-tXLJLv~BnG3RRRBpRsqinlNa2Ef9Wg0m1X3AageZ1w2GksMz4l0cLz0qfmhadyVRnJW8VK4mBelE8mbub5kbhNjbX4YXTVYdg1nYL0YpGk9ajCeVA2VthgIE9W-Bz52inHyAru9ILctGvYpqWdK77PF3aQRlkcLQ1K6gDUEmP2euzNSXycWA3rmi3amEsSEm2JeNsg1AR20kHAYTZoVS6bL5nO3UunQlPBf51Kj-38UHSRUq2B7UlmGWaQ6hQxRZ4pNHQCBeabWRJ7Uw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 9000,
    "stock": 22,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "smirnoff-tamarindo-376",
    "name": "SMIRNOFF TAMARINDO",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/642412/7312040017355.jpg",
    "price": 60000,
    "stock": 9,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "stella-botella-und-168",
    "name": "STELLA BOTELLA UND",
    "presentation": "Botella",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 6000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "trident-mediano-283",
    "name": "TRIDENT MEDIANO",
    "presentation": "375 ml · Media",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1686169069-chicle-trident-3-sandia-51grs.jpg?Expires=1795286785&Signature=ct3QIHcPR5JvG7Z7H6ZYL5dVc2Rnc9rt8tWYq4d8b-DZ-p0BypsNcJsZDOekwOwLASEbjhHGgypMS5upWCozOZHYjA7bQ5I7ye4XjTR6fsTeISDFWa7pnDFmsB~h0IUyfu8GFFRjY~IKApwhZwLk0X7v15AEdHcXp-TVLy-d~QtNg~ZJ55TmTO3wpSHrTwgrb94ix7bmXn9g106E5tagB9Tq-7xXpr4GnYkG4lUizQ74YVVUYD7dUIyf6hHovzwBw-N7w3KzBPqzT1CJBAfuxZBNICoIQWoQtzAVfSlSihms44PZGkG1bwcXa8qwKSa9GiD5Qv-sY8CcaSPyju~57Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 27,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "und-roman-352",
    "name": "UND ROMAN",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 800,
    "stock": 9,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "vino-rosaleda-326",
    "name": "VINO ROSALEDA",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 45000,
    "stock": 1,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 120
  },
  {
    "id": "3-cordillera-und-1",
    "name": "3 CORDILLERA UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659666511-1613768206.jpg?Expires=1795286751&Signature=NCqBjxLTTgCc6ZKxNwhh94iU-gPaPRZ3pChkbZ02jwx-bov-PfNeCTW82MchK~gWwA5cIA9SxwKptJE-xROUBxdSjI5eX6VbMCuRA8tVIg~AA0z~v7651ThVoEIJEzoUff6G3ff-iJBG~n~Vfmzd1zN~7K757qxmHcsUcfwn1uAdGZ6xuXMv3hqIPmXeBijLtC2~UbQ2iKHYAyX--S~Gwfa-oDriNV-levj-cDwjY-DPnVo4-~0Q1eap6qInnvfwOqouZcVcFmlHUF0UO-Q52Z3dBdboZ0Jwoq~XT2JXBHwl4EwNDk2ZVCy8700tWfrnNdAv5pKy7ZuEo3BfVPsq6w__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "absolut-50cc-2",
    "name": "ABSOLUT 50CC",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659666616-129_105_zoom_absolut-50.jpg?Expires=1795286752&Signature=bNlhR8tRJyrLtFIYWxeqzrZRBRLr5-j1yxBv3y-6VuyA3BcLQuckDfq9UWmiCwgYbDl9L~hPQTdk9ON~QfcxGm1lM-WPztZt3a-UzhM~NhMCdqacH3igZ6gf1NV2I07P7peMPLX9PcHS9yeJFhosaGy4qyG2MPB8h8TcUKXq88H3xtUs7Srtax9p12aWTe9US0dXrtPPlQoszpEVr7vQm0Xl6rQFU1GCaVPp1TeerYfCZz-JLQGK5zdOkhxyKnzM37RzsNKflO~LtM7V6G9utmkNSoV2Xp2eayoCPRfOt4MH8sruKJb5EPiilnCinAx8uRdnpGvuXvq5WhK2heHZqA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 10000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "agua-inn-4",
    "name": "AGUA INN",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659666994-web-agua-sin-gas-02.png?Expires=1795286752&Signature=mCQxIYO1UQndqoOJL-iGcAQ4c-lSpLAIzkMC4ImsFDIPc0bkHB9NULi47wmiiQRDv6aK6MQoNKz4zffa8d08V3bSnQdI1XhenVex-58AtvS2QhjMLEmrExOn5qLeiZMpBPkRq9skckdgfK9KD5YMwWD6h4Ho44hlUH1VmXSLjyfw0IZ3inpFtIqJbsREc~F6KY41p9ddNW3qltd9nauazqEm4pqLUlbLLrTDyH6M8joUA~0GQwiEPaZhQzec~yJukMyDTLcs0oQCiCVP6QItSdp9qHnzxEVw-KWmb6W7~hn83q88zLkLToeAtV9NqrUFE2zqwS~iSuvet2Kwn1suuA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 1500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "agua-inn-x12-184",
    "name": "AGUA INN X12",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 11000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "agua-litro-330",
    "name": "AGUA LITRO",
    "presentation": "1000 ml · Litro",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguardiente-amarillo-375ml-313",
    "name": "AGUARDIENTE AMARILLO 375ML",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 30000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguardiente-amarillo-litro-tetra-276",
    "name": "AGUARDIENTE AMARILLO LITRO TETRA",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1685120780-amarillo+tetra.jpg?Expires=1795286752&Signature=Ov6Wlgn82jx0SB6PG8blMRmD64VH6wRj0zkSBKbiVaEKySIg1IsSt5PBAH580wXPEWxmuPC43CDcArzoiWB6QlatOAE87Ns64E4nWCZW759eHYaGyRFfSplM5sZ--LcGisJjTiT9TlbhPJHAsrP4ogURqBzWYK3LaSxC9FAWHj0V2mtS-LYlY8zaVAXq1AkmG0jG9IGnaI8JjylKQSeSy-vwewwuIBAstJvBMuMByXLVbrkLJ7qE84R93Q4tvNgSeJBVynefUrMFqkEtekxtDWWzu74i5ak1a5s0qKfbcgo2y47Ev6c6izOdSwsXYZe6YyXKKh3KaPkLOls0kN1swg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 62000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguardiente-cana-sin-azucar-375-5",
    "name": "AGUARDIENTE CAÑA SIN AZUCAR 375",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147012-images+%282%29.jpg?Expires=1795286752&Signature=WVBdzSNkJwGarPBCWJ7uAUl8AXppAkrplg5bdjj0C8~qs-HApIQzUPpdp8iagWOam0RHqcMBCuXwIfBEzcQ~5fMTguhZZm8qbHO3zPhJhZwvlOmoTSLQnKP2HJldoKJ00gZfJSbAlsGT8RkJuxS-FwMU-ogS6n~PLWYBoZnqijjBLgs7vwNyCSsV1L02QYVnaID9v~fifgPIEa8Q7riRJv34kjDPWdKlme70dMIsOcQjXfFsGGjk-yD0YoToib0t7FQ1jlC6aqffbQiKLmyMgp4zHXP5uaEaANGruJnEWOuUPQsd3EFia6aTtoWZuH5A6THgefZMYd4t2G8-91QZ6g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 19000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguardiente-cana-sin-azucar-750-6",
    "name": "AGUARDIENTE CAÑA SIN AZUCAR 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659667183-cana.png?Expires=1795286752&Signature=Ln1SZr2fC~4xj4w7jBPCRwxavg3Q~PGkKx8da2UKtB57NL~Fzk1Jwj4MKvlG3nNPOrFj24bvovrKsk3KCGvcGDeilgu6L4Rcbkh3LVBnbUU0CuSpLH2dnbmJr5zAXMyrKP9GpM0WLNF-asE25y4zP8esfEsQD-wkgJ1YMcrbFszbUOUgc-PnPDSh~wD2iQTCbKMEn0b55wBLHfcDH68GI1ks1j-3zauG-AG~S~u-9D5U1mRBlbHrWbSXeOy4aztwvyzY~03K1G0QS1RyKF~RcnPhoSyV9j5re4IZ2i4FzNZAChq9TvYwGO~5otb6T6vPSQq64V0W~~7l41zcbvQCkQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 30000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguardiente-cristal-xs-375-7",
    "name": "AGUARDIENTE CRISTAL XS 375",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659667278-descarga.png?Expires=1795286752&Signature=hiBfxEVEpepoIrHSM3qzXIrPRgU8i4BtL3~8HKsX5DN8DoAKeJtoUCgtVSKwkjqd85lyK~ivNMhTqaMx3pemSF~hCXt1KtlKwKwPspulVA9V7-xdcFqsAfQOIc5M8Jt~YX4Q5iJEqbtg6-cXSX~sKlKa6lHzuTv3lK-~NAO7AJ8-zY7Z2glyxiNk5xsEoXlLMuKRTO3VKKuHwSjVN4WSSCJnJPr7okRaSfSy4ddgRvutSYIVA0SM36aOmmR3IrQ~TpFu-V~QdJEaiyREinrTqQIjO-QvCMeEHYVT1RSKMkvQEG7NCDIsHLrBeYLCueHnolZgel3eP1KNkIHw81NM4Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 24000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguardiente-real-litro-362",
    "name": "AGUARDIENTE REAL LITRO",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1852397/7702049000531.jpg.jpg",
    "price": 57000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguila-lata-original-269-und-if-319",
    "name": "AGUILA LATA ORIGINAL 269 UND IF",
    "presentation": "269 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguila-ligth-lata-269-und-11",
    "name": "AGUILA LIGTH LATA 269 UND",
    "presentation": "269 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659665200-Cerveza-Aguila-Light-330-ML.jpg?Expires=1795286753&Signature=FwTBpFwITG1tiru84qmcI0OJZdfJtoQ4MTCDIdoETwIeSibS2ZwpBoGfQp4sFFHSHjCzKxTdWDKb0zt4PMTO6tBbbWIbSFKvbKqVWo8A94x0Tp5yrfLZ3MGkVAblJ-8KNsfl3BLPP0nN7d8-sx8aXtml4hSBUp6WmDq0S6i9Tl~Ochdto3pHWrs0q65L9PvhZLsVQQyyNN3fH7Z2INtS0bGRploPF-1hNoEnbSd9s3YkjzOXERJobg~E~D9WJoVVGlbmU7cG20mIkM554-jKJhrQEELw9M4KQR4vld~26e7cjNODo6TjYeYesmC4X876nfBzpWLKeY5EULX~gsVC2Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguila-ligth-litro-und-12",
    "name": "AGUILA LIGTH LITRO UND",
    "presentation": "1000 ml · Litro",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659664650-presentacionlargeer2.jpg?Expires=1795286754&Signature=dV2Swal7OWRzT0QyqywUXV-9nlNSDO49S2~LDxe57Ctvsd8LXH7Vwap0vRA297C6hadPQyyl2kokeDio3BumfODQiDIKLEUr2U4Y1WOw~47mvYZG2i7hq6Vf99zEikiXf22wPQMIH97rYz20nJmPhSDlreCKXFZTvuj4KRPSC~hx0l5yWvVS7k-Z72Ja2cTlFz2YsBFIYmjI4g1xQN2O0h09W-M1764aT8Cvh8PT1Kujtd-o66lpMEXW~EXVU4-JR8NwQktMlGuBrhIabVMjBEBuX-GHBkCyMBaSz26OJz2t55BUyBld4qAenIls3YrdtJYkvc0pLK87z70FjJRwlQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 6000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguila-ligth-litro-x13-190",
    "name": "AGUILA LIGTH LITRO X13",
    "presentation": "1000 ml · Litro",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659665259-descarga+%284%29.jpg?Expires=1795286754&Signature=JRVn47ASbSpJvzsdJRXMMX8G~ElXADLwf~otDdoAG-yD8YeqOK9B6XFKl7nuZNadW1RImGDTEOdx9vTndNj-UlB218oGClrK1ZDsROXbfF3DirDoXd25Gjp5JDZCPt~DXmPXE0-NMNZNCzLFutFIuNiKHJXRwpkX-w5SjWVmYzOrWmKA~DOg1maiTmgRODABGgAdDUBj31I-bV1yxSTUCpKf1IgkChlK1JndaU60r0H4nxUNXhDE36EHvoVjI9TLrkx2iCrDp~3aQe6kz5iGGrPLBPdYil9nLATA0wcRr8NgMde6-DytzFTgeJfonSiKzmaW~O-Gl08yYHod7H2uvw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 70000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguila-original-330-x-30-338",
    "name": "AGUILA ORIGINAL 330 X 30",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 72000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguila-original-lata-269-paca-if-320",
    "name": "AGUILA ORIGINAL LATA 269 PACA IF",
    "presentation": "269 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 60000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguila-original-litro-und-14",
    "name": "AGUILA ORIGINAL LITRO UND",
    "presentation": "1000 ml · Litro",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659666231-descarga+%285%29.jpg?Expires=1795286754&Signature=ajhT7i1OhQK4n4LcEMvP-jw3Mh2dWaGBQQDOJxBkREE8RtxKtUeDQfxosKHiD~Qdq5YZTq5yEmBBamcZnJGnc90lscQo~69nDDc~eJzzGPEWJgTvxKKVtqpUBnEPG0V9gzEqXYWe6wGQNmggqIc8-3Jpfk0kPPRtNfTYacfFgKEEJOu5ZpvehVU6qQlgqLTEgUGoFGPXmJDPyBxe1V6YwS6msknH46~eF2b~dGIhPADPSmlsIj8kZ8k5Bfcmn4eqqS8euSLSPEoEqNz0a3bWGwGX05oshR1Y3RHo7R7D8HuPZ1zoedIlNvX3Jsv1nd58yNfYlbRlKz0U0tamzrA9yg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "aguila-original-litrox13-191",
    "name": "AGUILA ORIGINAL LITROX13",
    "presentation": "1000 ml · Litro",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659664298-images.jpg?Expires=1795286755&Signature=eDCkfSjHli5U8-7zsLc7sYzdzzA30ovWbAyNYdLaB6fQ-HvhuQGT6bUY3TtxGqTg5Jgd0g17jQ3knqdl5x8-GX7z3hPYYakL4lwzdFkTQFuqgclPoUGqYcJmKh-dLgdVrulg6qk9Q~N~4PEcBqtUjNrZ~u41iLQaC2Lld4QV9Bjnr7DDZoxWs1PDJcAJHbVQxO60nlYbgaV193--xDKgkcJhY5h6P7asKN3LhXvbQZgW8r5ilRu~Szdv3AtYbcj8GVmWQwX5pYKo31-6SNQKgNmt2ctdbV1WXTo8z~bMf1v1j7PonSwlPdkFlV7nPKfgn0ilmPJDOjt2IzuJqwBLXA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 72000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "amarillo-litro-vidrio-369",
    "name": "AMARILLO LITRO VIDRIO",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 75000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "antioqueno-botella-litro-nuevo-item-333",
    "name": "ANTIOQUEÑO BOTELLA LITRO NUEVO ITEM",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 60000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "bacardi-anejo-26",
    "name": "BACARDI AÑEJO",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668531-images+%282%29.jpg?Expires=1795286756&Signature=k39DJnlmvdmrUaJEf3Dy0aMz8aL~WTsYy0tGtF-QH4vmsdOzK1jtJmvhumPyvy3ORondSp15xUNLYu68uFAiDTd5bAHNu2ERVZ~efEBYSV5aSDFNxorZrZyXC5f80cAjQknrJWdofIy5ni6mo2dAZpQ7M4NeEJO8vuvYkxOqK1zEhUc60Lc4wzLeHp9ZVkzbuiONrMW4DO6JT9GlOusJYKibqFYxeSNM1pDzyKgaTfA3FhcPUctB9GMWb23JbAiYmZcagYSh~q~5y6PrdJvXQR6xwj2BfJA7TRzFqpbVXqsZNC5e-o24sDgGRhy-6kkUBAEtlrK5NxjKRA9sXr0lAQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 47000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "bacardi-apple-27",
    "name": "BACARDI APPLE",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668558-images+%281%29.jpg?Expires=1795286756&Signature=JHCHOAqFC0QnU5UP6wA6H05LXGV5OLt7hDhF8Y-SszC7mWRFQTqyiYywrPWcA~9NewpxdmqIX5kOQQr2wgcEWUgkGUr2Ds54eZxoxwyZQaAK2ZngiMWFaxcrt4SmAFmE3Ve8eL-qaJQx7KiEElQL3iBAYkAgyam1-Nniw-2aoy8~xSwrDws3nhbrFIxJO08PFNQ3~yxA-VtNplT8QzdT2AgF~gVimXU1LACYDL61m9nzj2PM9Z8d57C2IsOA~0nHYCr2bEZwOzV3Smv4EtYFU7GgCzb-9fSpGXrqw0vNmh1rNKQjdJ2IxXvAJZnyRGtNx~miAAPeeDlbm-JCb~X3-g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 52000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "bacardi-limon-28",
    "name": "BACARDI LIMON",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668586-descarga+%2810%29.jpg?Expires=1795286756&Signature=II9-ov65Or8i0HMelopY9tzNirqa~dbRG-iPdd2giEQdxMqjkcEloGxZ721RN08fCLPLuD6OKSGhDfc5uD5qGYvp-17qDnkrTWvPEpAEHRIt~vCGBs1SYyGbb2CWQYRWXWhghfxL7xy9c9ZQ-HQSuqITpxyM7vobZRYbMOT9ndd6zT0JPJGREMSbjHZDRGQXVEfCrSArNG06inF5lM3ETwK~S40RsoYPl3z4vMiiUWTRrkxM4AriEpOI1dhVIqzU3vynKKi1HDCJIAcoLHp96GxQofzrvRyjS-G11KNxjpK261cdDXjeL0JraND~deW3yltC80IgOvD0YEl~wxZ8tQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 48000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "bacardi-superior-carta-blanca-29",
    "name": "BACARDI SUPERIOR CARTA BLANCA",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659668614-descarga+%2811%29.jpg?Expires=1795286756&Signature=CcfBSF1sAqeODqLeuv0oRtnyeQ9kb51cEoqoloz6KsgEW-F0XrmTcoKA9wIowdp0Wg0YCm3ahNyST2MSEXvuXCbKIlRCTOKE58mvndyQMsNEMFz2qKjfaoWcsOy3Za9d10qElLUKfhExJrMO2bxki8cVsDJLe4d80vIdI8ytnH1gS1~ZkxdWehigFoantTouiDILLjEGzN5Q2r3qW7VqeoXrpFLIn81VZrse9GvV9iZmnHTv2dzDl16iGM8WghSptJXj6563t~uN9~57cC4nbAVcj~uHIkihuXsL-iMwGcPDf7UwOOlISND4nIUnccu9q8zzTAQKmlxYghK5SfFCqA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 54000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "bahia-litgh-und-315",
    "name": "BAHIA LITGH UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "baru-seltzer-235",
    "name": "BARU SELTZER",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680728255-BARU.jpg?Expires=1795286757&Signature=FcJFKBZaYb3nlgsxeb6dkrvTcZ7oat0CucWFAjElKoVRL75dlwR75tiDD0xkttZZ55StnLrkyBgtzcCocXXzv8SxevyrzoJ~hG7Zi~9hVQhZt1p-bB0RreN5odNbM72yJ-kNy68BHgh2ykELInlZ3IMFK~sKdydTBR56tFnWaoawVqy2lAh0n04iA8390moMyeGo4MA6~wn4Y1lG-tIpJH1mqbKoSCbqEmchEfdKdppMT21wuKnuWcaDA2ZOUURSubRa3pQiEpmP99FrjKRGP2yhZkLX7DCcG~1NcFUYrgmiGe524fvYJHgsxD9GxF33tdDb5bAiMIzCnUZmfpOTKQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "bbc-lata-und-32",
    "name": "BBC LATA UND",
    "presentation": "Lata",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669073-descarga+%2816%29.jpg?Expires=1795286757&Signature=D3DrwOG0~cEYGGoK2gyi8rXKOpSvOHh268H5Va0UAYuZYOEPy8k3KKq26JbTmSF2F1Daubda7pTth4V0XvonVPmzJmEMtnE9myClGbvEuDSwQJ9HhFE~LbWcP52J9db6Pv2oKdrYDDcAa0m5bKmlKPh5gChRwbzQd6TUsNNbn0HWr1Pdh1NfK6iB2VasLOk8dJaNWWw6AFNdbyit4b8fZvVIRJiuDCwBn3gMdCn4y300sSQ~wCUXCqKEBrScAIqm8s9AOW~XbD5JwUrahh6rnKnrgJPK-tqmqWagNQAC8MS5HcICKP8thDWfEWk-nXRftjq~vyLpOb3bTa6SnRYSNA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "becks-botella-und-33",
    "name": "BECKS BOTELLA UND",
    "presentation": "Botella",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669259-descarga+%2817%29.jpg?Expires=1795286757&Signature=cqp2PV3nD4Gl-C18-BIbXx4q-xDPcMiCmCvMypzNwPA9zW1epE8j0YfFYsxFsvR4Zo3RYOEPVZqj4wHNi4s9sJk3caRWscRZLdJkCTii6yMtVWOjSzQq0pRCYex1eoKNzUirqoRMb3egI6nCtpSblc0pHk5ob1XnK4exzkiAzlo9cCYP3elEtozvbSdYpXt6eUNNfZ0FkPXlTmVOGC3JQoQ0xu-v5DSy6lsyqtmKQtojDmkz9MVzPninOvDOwrPaGCyhO3fNlfpYUKz-XBouRf1JBV-th1G-PPk1l8icFDbJ4DxbCHKB8bac-sXAl2mSqyHx2g2NFMO1HlY1WBbhWw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "becks-lata-und-34",
    "name": "BECKS LATA UND",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669218-7702004009951.jpg?Expires=1795286757&Signature=P7F6flRGgys5DyO6siqF4TRP0tkqoEfZCrwZ6MkhFjl8felEGewX037WAyUR6AyWBwYLkNZ-kCVxeb-7xnqcIZbLP3-hMtJQ-YvZM4k1v8WDY4S4wUrXdTQTrsb0EzJooqKXMgSzQZBRPgLPcmv3CSPd9~omckeHKA82DxDIAzILNZWASrWfg1QHXY92FWxbeRoRjlg9dMcwgZ4wWeoXKcAdcP0eu3dagnOcOD0rBMEUIdwyOKO8uCW~XC-xTT6luFFbn949IY1avy9pgDpmIez449mey5h4XpAUNpW5Hbk5Paq8JTQv7bokyPAtSh8H8wvJ7zeXHrrIRNvaGHlU4g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "black-and-white-1-5-l-337",
    "name": "BLACK AND WHITE 1.5 L",
    "presentation": "Unidad",
    "category": "whisky",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1899170/5000267024233.jpg",
    "price": 105000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "black-and-white-1000ml-35",
    "name": "BLACK AND WHITE 1000ML",
    "presentation": "1000 ml · Litro",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669410-descarga+%2821%29.jpg?Expires=1795286758&Signature=cbsRk7CxdgZIzfLvLbklUgbQqyKXJIR5msqwyheeg9uV~0wGSPoK6WPQpY9AQvtbXNkvVhHKWD-DSoY50potARi3J4OqpGdchOn5gChr5V1szaE2w~Iu87WPCHqPhAN5w~om3aUmK7iTEvVQ2fbseXeH9f9pApyTrHu1ko1FLVtBjsLgZRtTOkLi6QofiW3Ab6WY0KfJgdYFfhYFIZzE4Dp9TbGGPTMvFI3iivJ2VLUnMpbXY4~sKv2SgS3sXQp-72m6ynnBZeWi8pl2UqEGjz5KifoJmp44V4znYtzbN8qAEtpm6x5KHOqMKELl-wXcI~TYSl7TXyKurpxtUblzzA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 69000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "black-and-white-200-ml-36",
    "name": "BLACK AND WHITE 200 ML",
    "presentation": "Unidad",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669547-black+and+white-1000x798.jpg?Expires=1795286758&Signature=dBbxX4VRxHa2GLgZ23ZRrHXbivK479AUk~1iFBn2FTKaHs93~DsG1w9zfWKotwXyuf7znZY7esZbehdKZYnZsX9egjUJJwEbIHdpDWw8SAj-in2RmNuVMEk-grWTAby6DWrmQoQlFbgkD9BLAcz6EEjx~IWHd15ss6wz3rY-TIgt3BwFHhQpca2vAwmZsc8SFr-2q5T6UuHqhVVCy2q8BfGEp5Kws247R0x2-ZVMqk98LfGjKKKlnJKHqeDSxkgZsjq0qYukL2yr3qDuNjwlnVxBg0V0jkWcNrYN9cTd7JkokQTNTeRl6kOXFt3v0niHNiR1w41zuVPc2JeoKPXS5w__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 20000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "black-and-white-375-ml-37",
    "name": "BLACK AND WHITE 375 ML",
    "presentation": "375 ml · Media",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659669438-descarga+%2819%29.jpg?Expires=1795286758&Signature=PAJXHr8Z4lhemHhre6JYkfzfuOxH~12cS9bijvkvbXflHmZewi9LrKPZWTm~7lmdx8VTBGMGfQrpe9oll0fnRf1qrjHHt75KeEnCUCPLuc7Sr6AOY-hO0MFVCY72Wzp6V9wkC0N-8lA9ys8-3P--I3RdPP1FUTPO8sdYq7hNJmxFKqfUqUfRFD~c4R-TXB1nzSy5LyPQofUg5wB8PpUtbrn5eF74uh-7zSCeuo9RfJuOoOj-5ngqBswcc2VAae9jBoDOoUSoJ59LdKL0r3KESk73doep4P9UEWZJkGqPUgv6ezMlrfHa9d8RlQM4RdMrzHF6h32hS3keF7rNr5b4bg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 32000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "budweiser-botella-und-249",
    "name": "BUDWEISER BOTELLA UND",
    "presentation": "Botella",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680728883-cerveza_budweiser_250ml.jpg?Expires=1795286760&Signature=iyJH7n7Mtl7I93T6mQr-AlkPfDRy6JyZTba-NGNNjwP2Wxl65DHVrPybm8ubgZkgUVrk~ysWBwFgbcIP75knJyL5RdMif3r41wPJQ5tBz6X609DTvdCxO74UdQnhCo0sAJjgcSrhfzwnuR4pVX9WFTeuBBKo02PoiIi-aoaAGcM3OZulUdOcA7svQ3pq8g2mGNf9nFr5N9JI90dRtVPLClhvKEkTBCMWtE8KPpZkuRZioYwilXtyxvuXicHuseEAjC0RlTR58Nat9fNCvcP6aDqLCeHInyzOu7x-oERBSvw-qF5MreqOh8UUdC5dWCIjqJvGflT~haMOhrVUtGiNxg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "bush-lata-und-48",
    "name": "BUSH LATA UND",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659670959-images+%285%29.jpg?Expires=1795286760&Signature=bACEdLeQ0Ou6ct~zNNWGCPGHOsTNGtpuJk2R~cq0jcPLESX7C0lrvQVPJtBZ5uEZStbjtrkyOWeida~cqu74O8AwsAmrfTnu-WCzPqEmlLQnvxrXSnjC5oYJ7E9pKSffNvOKkl12oZPtJAJ2i3lP-DCS-v7nPvKE-QTbpD3hQ~yxPTUO2hoZWjKzSAE~TtVYnB296OglQscRaq-NbC0ipESeofuvIffhDRayHutv-oigG4356MOJhbbLZkHIyZCcchEGk~WhSF~d9i2d10zzxD~C6wYMeemgDyEQMICdbcjqraiGOdCz-vbP81V9D415UDwza-k~~o1B3zXEAixznw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "caldas-8-anos-375ml-327",
    "name": "CALDAS 8 AÑOS 375ML",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1490643/7702168217308.jpg",
    "price": 60000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "canada-dry-pet-400-239",
    "name": "CANADA DRY PET 400",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "chicharron-grande-165g-49",
    "name": "CHICHARRON GRANDE 165G",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659671082-descarga+%2833%29.jpg?Expires=1795286760&Signature=iVJMv7DU-lROj8-UMnAkTk20rWW~pGv28tJII1pGXAZ2By2ZpcdGAIHTMgcr0jjUpxe8nHfnKuecgOsFHN41JvUeiouJV3VHGzJc9PPqUJt~eznAQesE45bLzqEA6szQ~KKMp4wkgLzLugwrTgDNysTC5ozbEfSDfnpf4MIrp6UuulcxWGp8MPFMkDBVbterGwrYiTS2d0tLniWY9eUJNfHJQaoDKgE-7bGNURSA3-~aW7mKf92PQFsunrCJ7Kj1jBmo-M-R37nkj5KRq2F1gX6l5r5C52gTBgObRvb3bDf5TaduS2ZqcaaZqK0OHZCpl6JwnhoLxHcaO-CKp2DXcg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "chiva-regal-12-anos-700-53",
    "name": "CHIVA REGAL 12 AÑOS 700",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659671337-descarga+%2836%29.jpg?Expires=1795286761&Signature=MPPrV1V67XyPED58avh80luGK8KXOl30kXHr~N3APvNmUi3UMiaRKe1Hbi7LzKq281IqEj8Ee1SiUszREhOckcNHH8LTXpOJGQVmH~jro-TjfqcWb9jkuPQoIdSl7OIAu~p4dCAw7YIbeb4yi0HIJAc7raR7lRpzS~5w3bRyJuZU2TSSdPjr0qnFLAW77lYD3Izulkj0LLoWbno4V0eQ5VQSAtj-f6rSBbiNH3OS41hc1IOqcMOAlNwJEgbowWh6k3CBvZfvhwQalL3Jf66hXKkaiN9RrDVW-~qu6r4zHa3XZT2AeQE8Cl34hlnYG20bqwX~4FqbHO9qgnMExSlUHQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 131000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "chiva-regal-extra-13-anos-375cc-58",
    "name": "CHIVA REGAL EXTRA 13 AÑOS 375CC",
    "presentation": "375 ml · Media",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659671948-descarga.jpg?Expires=1795286761&Signature=X5ZL7NqkV0aMbhabxZPd~zubHwL1dGKXoyd2H5TTorWbqnYC2FxO6RKpw~Hujsgowr9VH5t~Fa0JwsiGqMjffhDa41Ngigz2uSZee4vrhz1c0Vw3KRVdfzLiSm7ps2yWWg-qnx1PYYvn5XT6YPk65LBlkCivt2W9H-ha2jKqej6qzg4uxdhBEJ0jwCwMaoVsz56pIegC5qGt~FnX2QqRY6tg0BgQR7apOsKU0fwHf6MYV6xkSEaUj8FhdYwBSGKrRcHzE8W9N1o79WqlbcG97Q6yUuq1GsGGa-r20qKxwavcaEHUWWPCnfHWPYsJhlHpCwMKu~lUqIXkhqbtHEqgMw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 87500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "chiva-regal-extra-13-anos-750cc-57",
    "name": "CHIVA REGAL EXTRA 13 AÑOS 750CC",
    "presentation": "750 ml",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659671994-descarga+%281%29.jpg?Expires=1795286761&Signature=evvu~cuiclewLYplcYoNSRqP799Wqd7UCWqhoT9I8jundKT4MEWtCg052ujNO4C0~rF2TYC0xtdJ~lM2cf4sxqtVnTg~huUY7f7cExdIWvQy7JE-RP3lv3mtrvqOUEBNxJ1Um10DVCFAgtXQ2K3rgo6HtkOq1PKaQozxnnkCxOoVWW8lewUmM6T1Sat9hSOcIk8A9zDosSX3bGxgg9wXxFK0KMVaP6AyTj~2EqaE~5NpGBYt85b8Yj~fa4NHx5FG2xo9SXRAZInnNnuFXGZk4qFGUPnz~9fu9lzR1elXaj2aW7w24s~kOZ8gErprgJ4EHyttsLEJQZwJ6NNpaCgogA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 130000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "chiva-regal-extra-700cc-56",
    "name": "CHIVA REGAL EXTRA 700CC",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659672144-descarga+%283%29.jpg?Expires=1795286761&Signature=jhVua24gBURQLKGB~6yJeYkbv9lTrq91E0Jt65I6M7cCbbi6Qv6N9Nxh9KNlpVXSiwrGRNUcb-IqRUI9xY3vCu3Rv2XbYf4vMYohj9uAbtsUUQSp8LqpYS0xNRTVQJSRGdPd03LbB5u1oh3RMOXxXl7e9nscXGHadmA2tITxi30eJVjqxADOuo~n6z09heB1AEzALRUgt9-zHBxKkrDACJqZ0VG4XXUjVilcWuU2sP-2HE7aFOJt6YC9PuaU4p9fb2LPXWS4pTGwfRx3Zn~rkNrdpmEz64x8ZntZtwqeHKJYA5ZqbX5NxbMIgnntRrju6fgy2UVsQ780zP6SYEDKLA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 145000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "club-colombia-doble-malta-und-61",
    "name": "CLUB COLOMBIA DOBLE MALTA UND",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659672976-descarga+%289%29.jpg?Expires=1795286761&Signature=lGgNl9dyRayamdXu~LTSP~i4BY51BbakkuxaEsh99X6Oke1eqqNtlbsqUC8K9TQTVhGLUSXqB1AqRvB6vUX0-0z~O2L1mIMRnKaHwR9aiskEQe5s1P28SiSK1qf0kqDlvT6sZcu3OHkhlABQsE5mIpJMvrKO9iXLNISj6jei-bdKUCYpaVGKduPdGZ8bTVGtmkB5rSD~INaOvoe6T8IY4Mq1YOfogTi~lRp-qis29o5~KHSr1jk2rRsN1RVz5D5iHD~xmK8I96WJA2jz43r9UBzyI6UbqsF2ZO0ESCAF1SVmMrmXVWTZ56yvrhUqq2cL10IcXz6524CYaARSiAQumQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "club-colombia-negra-lata-330-65",
    "name": "CLUB COLOMBIA NEGRA LATA 330",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673107-descarga+%2811%29.jpg?Expires=1795286762&Signature=nESIPF-teMRO9vQ3VsWrADU-gEPN6ksw7Nn1Hx9SwVQSkAF~8jdabOZRekqn03uP-1esEumvY4XT02hn1koJs3F-ZznBaWIH6L9UMiCjgmRadVJWt2Y8ZsbBMJ6B8GIYCC0J4eHOCEKPdFCNd2qEtXeJdn0FqBJn4smAZh--yRvQdsA8tZDu-lRIdHtZuDzmIpNbvYAZFrNvfOS6ij9uEmWtnYvxbmOXLDo9D0BqkZOVxc-Bmx9Im0Svzmb6Qe6-f0MwtHKQeQt831iuh7wf~KaP8u4FaFlkkOyLbsxx5~GlrBgrG5Rbn8N6gaixmhbJUmm31R2Z~puP~2wGe6Xbsg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "club-colombia-roja-lata-66",
    "name": "CLUB COLOMBIA ROJA LATA",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659672522-descarga+%288%29.jpg?Expires=1795286763&Signature=XDZZd4zq-K60uqbGcU3duBpgvYa~0zyAgT~pxvxnbc1cLVAz4K-hvv3nJZjkjRIbui-THgpgVUea7nsxHIEp1VxQo-q2lD-M1Ltq5sctWN8cDJ8wfPCHADzUahdqy~RAy~WzZGlnE-tkvJaiRL85RCTZfooDV3EW~CeH9X5bHKXke6IAdgv-lpFP3hRVkQ6i8LQm2yQC-~dXHQ4zsxZlerUXYCEt6HKtM-Qic822fWLbljcI87g3D0ISbuEndkQ1J3vFpHp6ZaNODJsVz8UfjX4KmJRBoJX~JZbsrTxDE7qsLGz8j5WsDo4FwRQ7zkSEYttmjLjJJz2gWJ3yCc3cyQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "combo-master-ltro-six-becks-236",
    "name": "COMBO MASTER LTRO + SIX BECKS",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 197000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "condones-hawaii-72",
    "name": "CONDONES HAWAII",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673499-descarga+%2818%29.jpg?Expires=1795286763&Signature=qgqoYrwF8nXqFZsFYPt21yZ-YnuMuEecCyvq6EwMjfx82pU4~tchV7lBsseQ8nUI3SjaMx~qofA66xJjPa0oDgyfLBhOqxDzpweps6sQaqHs~zZF0CEzUj8Eq~jUDRnCqe~dFKBLX9~zaqfA6CyvJ5McZweOCydEqUL29cCX2wvYfI67b8-kDpVDz8LDZ9r7-w548ZuJIHgNfORYTH5QzsV2kNwHOoCYqE26T9VpoNKnij8kdxmhaiEnLkUpSxBORwd3Y~VwBrooWIlgqLpyFfBxUU6Zy6c8DFNVducmpCgrbQHzjLmREkyfiZdJto4pmp4vR4MciDHq~ks66Rk2UA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "corona-tropical-75",
    "name": "CORONA TROPICAL",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659673678-descarga+%2821%29.jpg?Expires=1795286764&Signature=J4Ew5yAgSjV7cfnNp4~Vbz4Vv3Cvz0s6XJttHRGO8PsABc7Bho2qf-bB3Aa3pkdoi2~fBmGwQmaCr9oCJeVA~vEnVGBgOx1o0Pj5CA5RTRYTVMCCvNKJb5ZZwodQirux8cREoNWUu3wlyo0J4orkCO~0s-KC9OnS6ezah~ZD3OPONcby4vVTzYPfsv~sKDnSloazGLkYdnuDtrhqWSulfQye1TewGX~EV4RFH55f08R7pdG6GRL1cU5642HYRx78NcpWf2Gxg~ve5jMPkqQVAU8JjzI1FP6B9Do24ARgzsi8VX3zl~vTh4ZjhtahAgapKWZZH8YFAqndlazrCdJmmg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "costena-bacana-lata-santa-ana-356",
    "name": "COSTEÑA BACANA LATA SANTA ANA",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 15000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "costena-lata-330ml-und-366",
    "name": "COSTEÑA LATA 330Ml UND",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 3500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "costena-roja-330-x-30-336",
    "name": "COSTEÑA ROJA 330 X 30",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png",
    "price": 63000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "cuates-lata-357",
    "name": "CUATES LATA",
    "presentation": "Lata",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "cuates-lata-grande-371",
    "name": "CUATES LATA GRANDE",
    "presentation": "Lata",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "domicilio-237",
    "name": "Domicilio",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 10000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "don-julio-reserva-70-700-ml-290",
    "name": "DON JULIO RESERVA 70 700 ML",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2500354/2339726_a--1-.png",
    "price": 856500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "don-julio-tequila-blanco-700ml-287",
    "name": "DON JULIO TEQUILA BLANCO 700ML",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2500354/2339726_a--1-.png",
    "price": 275000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "dorito-43g-82",
    "name": "DORITO 43G",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659667625-71U66AuAmFL._SX569_.jpg?Expires=1795286766&Signature=qEGf-ESKYj6osc1KdiwvyehEVRi2QG-v30DZu8112VeAzolxyND60oOd7ShMiOcLJGtspMsKWRjeOzqmYnbKm7KuryVJO6NFukCfFJAuP~rsQ2syc-bQJZKanuZTLIwTqzJzebnCqTMufgwXS7Y2tV~AGq1DGay0mcyPW7sj0jbvntINC2O9b4CULQ~dbCyqbqA5pvbI0flVfTeCm4TA-fKoReMuKwGc-7uFy8srZbeGJnwh9k4U2lDdZs8RBKIuntWBMf04CMVv0d8T~Vx0EfkfR3E433BLliezoWZzH6cwC2a8SDC1V09gzSdXuT4aXS70z5TvJ9SpTAwAvxKU0A__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "dorito-megaqueso-180g-83",
    "name": "DORITO MEGAQUESO 180G",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659674831-descarga+%2834%29.jpg?Expires=1795286766&Signature=W6SLKYY5Gb8ObjEgJoS5ttTS39ZzQyT6VR6ayaHlE9OJ43WwGk1bHPtRUu7nB~caqxjA9QiZsY7xs37~T6dfkG~VWVqfH5KrvZ7gckUGsJESFEGrNHXpi-M4cWIOyrilJUuLfAnvcgLEbPRw-Gjb80pFmYI0P82VjT~b2C5WmYu20DFREL64noWWzHMUzHeAOD6JbHji3scuAJ18nxYEIeObWm~ox0mIqSTQpCgzZ4qx7KCLFK~sbWmfiEh3aSH7mIJRlTQkXdteJSn5mPLK-RAU9V~pFkptyhfn8HqjSWQVhA4ALcL8TAXfsGJT8m7RBsUZ3DTCemfujaQHMTr5ig__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 8000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "escencia-vuse-87",
    "name": "ESCENCIA VUSE",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675206-descarga+%2839%29.jpg?Expires=1795286766&Signature=ntzFpCLZffpCVbaBrNopoBL2Z7LYT-U44qowrn0hyM-ksRsNdKM8O4Pesm1gvaRlAUmNQfa8Tkr01qxauM-Ssu3jH6vBukphFInfml2zoSGZysA0vrOlAzQ5wQXY0OOrSul7QmFnvkKu1jJLi0ssaYJfTo~k2KfvN9q2lfiyYRz1h-fv0iN~7CAU7GSpB3U-I1-6XFHY0SNlFibl~0~ibOH7oMBe3Ii3X8Rr6kp0xxS511EkoknrR6RE4yOELSLmmZMZajMe28xfqCGIZbBGU1hLUjhE32ftAqpCVeNXwHgJmCegOUTbMsKgpbSKV~zacqpEp2nTRWV0W8uqlR606A__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 13000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "famous-grous-89",
    "name": "FAMOUS GROUS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675312-descarga+%2841%29.jpg?Expires=1795286767&Signature=bx67tg4Whh6rRiIpsOzwwfb0ZVoizSUoJsGwit4079wQ3j6QfsdGJ08-SR6ihVOP~4yitfND3GzupiIynYs3eh93gL91bI7Agm4pZtx4BRC0YbE69K81daE4l2rSrzUBdEWCy3ZdjctnXxH5BsPAwXe6rkb9kN0~mqJh97LyQ6TPuFPCgUy-2Ze2yWx~~tn8Afl9sR6AxiAXMTZupdVAqOdx7SaJy2M~-USHCNfHqWbrYZjfw91xjqJCEKoCs5sj1LJ0YCM0gDlJLgp2Qx-0sjtlrN3ebjxWuNs46ID9pWf5ftUWkVdEd8srWEm1Nsq410KHiMn5vSh3xyNbTRHYBA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 56000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "full-ready-91",
    "name": "FULL READY",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675406-descarga+%2843%29.jpg?Expires=1795286767&Signature=ZBYzxrkReKmP7rt2C8u84q2XzjMYR~Lb3OfWIXCUz7WgWib5FzpZRbWelaCghyUHxQwb~pXvBKL0AYwi9nxH~EMUaQphaFQNajrPWAlwxfKHJ2wgTMecgPb9xq7XCcWBveLQ-ez69zn~7YV3~R3JrytO51ebzAAxX5-kiHK7NQd5~1VoYrRFy-jmth3S3q8o1934AMqxysIcMb9m1~0OSxqy0juT7Tin1PV5g2po~ShozV9sE-~TyE6~9aI4StkI7Qyb4Mfq9PsPXmOAbympgusNiTdOUSIvxA5YQEo47BAX0MGXAnPm-E4nCrrqr9KsOnldG2WWK18f589GjtOK5g__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 15000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "gaseosa-postobon-1-5-92",
    "name": "gaseosa postobon 1.5",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 4500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "gaseosa-postobon-2lt-234",
    "name": "GASEOSA POSTOBON 2LT",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 6000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "hatsu-te-95",
    "name": "HATSU TE",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675572-images+%288%29.jpg?Expires=1795286769&Signature=LaCFUhGMW~Prc-yqe9mkOwa6dsWOB3U61499B2wyxmhCIVLBgWx9zTBtZZ-lz0EE8sYbkuPTHoPNiwI-2LIt2VPYJta4GYo2RdczwP8QB~xk8z3NWltTXbd9iePw6c7QkYdPckXHv1fdCuyv3Q9ZJXL5~uCPjddpY0V7Xc4uELgD2XxU5y2-UvDvt7YmKEdOVvNjzPiyeOkxorQfVA0ZDCCvEJn6oY7awcX2sidtX4g58YuBCMWSbT9OqcUO8xh7CJXaiqFCAsEkUsg67nslsZh5fjwWhIJC48DWbsTZnTSUQ~PddLfDpLq8Q7P4ibwnjwe~z9gpL9xO0lvzB2OOYA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "heineken-330ml-und-97",
    "name": "HEINEKEN 330ML UND",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659675999-descarga+%2853%29.jpg?Expires=1795286770&Signature=KgoeSiY8WehkX9f5y-5kt7vPcw3B2abA2f~jEuj2LwVzWNlLPjCmaKgOe-8qEQbnwc~eiV71z0~aMI45MjQAHukAwmAR-TT5E4XAshrU4u2Z2wlxKhX8CGnVI6l6KsNx~EgSbrYx5GRpdVYhBteTEkxfrdcg5KPi5FlxDAjrtaaEc-BiF4owpwbBjyGubh-ozLPir7J1WuiyfzW93wVojDNoT5ki3kq6pmeO9vombxi-MAZYAX-Z9LasveHyVA08DCqTRagR676O9unRtJFA6Q9sllWgRcPCyDLcd9uX8PLIC8ore5OvaAiqykbI~8J88YtyYSLMUqTQ2iDyRP6Nug__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "hidratante-inn-99",
    "name": "HIDRATANTE INN",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676072-descarga+%2854%29.jpg?Expires=1795286770&Signature=NeaBgTuHtdD4qBzSkr3q1LXNUFMYaNN3VxD60RNWMFxzMEiJ4DojGjWEZ7dEjQtHsMz1Z7~42Mqz~6XbGqvg~iurk5CDG2ngLx9i1jnJoaeTcnAMl327PeYkAdDSNYTglCVSSC8FMEfFlNdKn68f1fWMOXPSasqSIHBjUWnI6nLWaWeJVFMjJLWXG~8wxI5DdxvWL-3Sy9FUG6Fk7abn0Q2U4bsiUF~aL482hQyVAr1Zcee3XCXAsWx0XKJ47T7ZhvkfF7qjnlpfdU05nSjVk13XZT3tvFxHyi-NrzSTkzij5y6qU3xHFowST8JL69shqdjMqpkLLGNTePt04Q7NQA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "hidratante-inn-200",
    "name": "HIDRATANTE INN",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676138-descarga+%2855%29.jpg?Expires=1795286770&Signature=kOoOITwdPm9FRDSSvtHahu2Va~Zf~FvUiq7laRinhgp-wpEpe3kK8lHoXHr9d3vrMfv4QJMPJBGEBvyz~eqmaNmCCam5CYoxIhIB76SjP2G0l4rOu0gFUZKjyaDAWb~BjsITDLavqoeVbulUBMolJgOsmfkeIkUHGSgfiRVLY22-OOOLOohX8fCnQ2l5meVc68J~gGCAfUumcpCGdx9jWIhO8PqRjaLuoAn50b55X-et0rOuS1xsXdk6Xhgq8p4RjIwvpInmfykzCgkn~gVN1daC7iZp1Tnptj-xdjasLJESd4Wrj~qSBhqagM-V5DjRM~W3QHC6hdTSXnCIOIkDtg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 24000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "hidratao-324",
    "name": "HIDRATAO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "hidrolite-und-358",
    "name": "HIDROLITE UND",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jack-daniel-honey-750-101",
    "name": "JACK DANIEL HONEY 750",
    "presentation": "750 ml",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676251-descarga+%2856%29.jpg?Expires=1795286771&Signature=cpb9LWkaYRmWMHbKw7j9pCe1fXLL7zL0TLrQzlt~3EWSECd~ZIPKJD8RR33Tl8CvS0~yrpGms0Q9Dxnz0jHTUqejY9di-OFHi2UOjlIBIS2UqlXTRC7SaA~-JNSjKdhQXgEL81Cf21g1wv~UfHnu1FeDWdWqXYczyO6iMKfWxPzcRFFWQOSQQ2VGbshH~9oDzZjQU~9dqxqFv3VJKZXRCddlL7PV90qWZ2XYtAB86QTaCLJYPEpyBnY91522x27-lbTrfWqiEzrnzRri8Gf1K7VZ3xyY2UKqNah9E02QWmZXT3QQjfxMWKjutE3V3HiGODb7oX~q0MyFlbB-9aO6Gw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 127000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jack-daniels-50cc-102",
    "name": "JACK DANIELS 50CC",
    "presentation": "Unidad",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676316-descarga+%2857%29.jpg?Expires=1795286771&Signature=Ql~kgcR3wk1SHQRu5QMCFy7KN7EscxROmSFoHaR7H-8Zrz~H4sBIvwoVebWbnGXtAypYmgDI9f7Vmgj0T5qymAS9ULeN5JmhtgmyNCM0p24LTI~UB6hp~tVRUEmoMgsWsuDzo7gGApruTpP4Zf6XA6o-GDoTNr0zndvIHap0DSTnDc~JH3BL8CR4COpc24ketSEmqkf4SDG9UZgiv4M4PCEcsBEhNRnReIAm-9tGmjkfYB3rnZZ~KATW0XCdmmPNnduXN5a7WNWgQIFTOeBCJH6PjCbYuLJJmqswJdvVFk2zplOrJGSkc29ya4WarrhLrDwAtI4t2UQEwgtw48~0~Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 15000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jack-daniels-750-etiqueta-negra-260",
    "name": "JACK DANIELS 750 ETIQUETA NEGRA",
    "presentation": "750 ml",
    "category": "whisky",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1601267/7501035010109.jpg",
    "price": 130000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jaguer-317",
    "name": "JAGUER",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 130000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jhonny-walker-blue-lebel-700ml-284",
    "name": "JHONNY WALKER BLUE LEBEL 700ML",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 850000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jose-cuervo-750-103",
    "name": "JOSE CUERVO 750",
    "presentation": "750 ml",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676361-descarga+%2858%29.jpg?Expires=1795286771&Signature=lamSYWJ2r1HfbIw7xIxZajhbcwMrClQ5PVwmnTBh4euJ~gRx1e2uDDHiScxt5G3twBApWzt1KHcd2lj6QGYHAb27xvkTlvSjvaHOTUbMWlmj1IK1HOTw9QJVKSt8eDRp458UGUaGvn2PcBPZjmcZZA~2OEQBc~1SGeHTyhQQhoYoaFpdmrYT7z2XGyxEVIfrCRqZ~lyLQbyicit9kaMivpWIu-6ScKSdQdIoVbOrhe57l5o0j9MavQpgPFbqlej7GlXLF3UmyZ0GLS0a1SbUGJz~nTgGTnBUbr-okx5lzZjbdNB6YXYeXhChNEsle0c4BMKVotvDYZFNZNFrs25NRw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 90000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jp-chenet-coctel-229",
    "name": "JP CHENET COCTEL",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660146583-descarga+%287%29.jpg?Expires=1795286771&Signature=nOTgwSJLLBhx4IyrNvZZVdsn2LnCdesXYBnQzPl0MnyU~izOFYn9UNRY1O2iYz~9b8ySbqgxbu8G6fPPIslSW9egvgXdyJN7AcdAOZnRqW~WZUUkKwXQwBHSXi4zG4ypcqxdZbJwgoI3ep-9ppxtnCoG~W2A2MiZWOdyCVtHDpXgwQkQRK5Ngiom1wEIgCgq1b7XOVnw878EMXRlXIHDAmWucrQPKAXmFDmHYAbxnvU9pmTcLPgpeCnMUezTBvOQFMEISqZGfux8114OhY2CSCDUOAC7V9V-~VngHCNfg~-KraJWfvA6QuZIZq4v4yQnAAAWZBi7Rn-XNDDXmTJAQg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 11000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jp-chenet-vino-espumoso-238",
    "name": "JP CHENET VINO ESPUMOSO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 60000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jp-chennet-coctel-x-24-rosado-291",
    "name": "JP CHENNET COCTEL X 24 ROSADO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 216000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jp-reserva-merlot-cavernet-265",
    "name": "JP RESERVA MERLOT CAVERNET",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680729430-RESERVE_MERLOT_CABERNET_JPCHENET.jpg?Expires=1795286772&Signature=e3EDNerkhWPa9Rotsf0VDlcfoBJWQbn5LMPFvYuuRK4HQuNvZkaTh~XLoLSJophba47rHbqtJXEyXQpGNO0Z5y18BmFs1lqB4a8043DZ1Ey8ER0Z~3O-hWGedsvEqB6w0vp5vIcv6HloDvID-vg8hujz68KJM8K6NGOod4jepKOWFUVx6Dag73Kowq4eDdKaqZ8Ze7o3Wv8fec-ufQy2L9BosGhQ2APoW5-0oUCj3Csrt-vF6ARu~f4oJWRLYJ0JjhYUksttAayWxIOWYyMvVH8AuCVHdQzv1q1oK-ZTIbMfGS8E-wIfSQB7zO4RFzTi9lRFXTWWu0uE0-OcJAQZRA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 70000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jugo-hit-226",
    "name": "JUGO HIT",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660146630-descarga+%288%29.jpg?Expires=1795286772&Signature=EvDNCUaofBoIjKucg~ZH-rR9Y4yQRWjbdqVWSWCr8QUkniZlXOriptm09HW6qS5Dv1sAr0TLVDJ4uYbuJyG7YgXwi6t9o0JBsFybl6hwIJ6c5BjN9fj7xwSPFj6nsXmfM8X67KXEnP4sQDKdUthxe5bIvBZcpbGKLljFRltSCijaETIhAfskte990N52SULNnL6hc1sckYSdae7G~vjV6MlmqDebflxIEFXCf3Y~EZl6hd1DKtFgct~wCBF3dQr6e4eLaVhDsHByRfU1lgcH3Und-AlYCXgRSWrvfWjVHBu0l42tnE39N1fAz1kX7WEBkitvuH4855Vzgh9tOeYppw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "jugos-354",
    "name": "JUGOS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "kaufman-325",
    "name": "KAUFMAN",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "kola-roman-1-5-370",
    "name": "KOLA ROMAN 1.5",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2433580/7702535011799_0.jpg",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "kola-roman-pet-400-und-105",
    "name": "KOLA ROMAN PET 400 UND",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676571-descarga.jpg?Expires=1795286773&Signature=hbm5CoPaqxrrelM6H8nhLhqlbIYpmuMXWW5N-ivdE7rliKLOROGFJ59KYUU2NWgmUPBEozW3f7tp4~6RTaV2FtNA6knaw3P9rLTIuEHU9xplGflgvxwN6jPgFarGq0m3o36Py7maWDzdwEyxDyKxmUYmqD35rzgP7D8bm1tL1nWUaSDa8hWKzmwW-BEcj8eniMEMbPgl7dyBW9gD~NGZVsShh7RqvBtKuZvzrMaQ3qTzQ2S-D~ve-uD8~P8I1kM8HOjwDa~2BZuhf30fRFpyQvfJVYW8jcBOuBhRKcHV5Dd2t1uR7Ed-DnkxgQb2Ox1ODVhOl8cepnws7LO~Z-nVHw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "kola-roman-pet400-201",
    "name": "KOLA ROMAN PET400",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659676608-images.jpg?Expires=1795286773&Signature=gqYyruB7exqcXusNMsN2uhkCyPDZRlXo775uS6yQ7XnPCZG0aIcYhM41vMlPBixv4zZOhjdxa8tNuYOgD5pBBdVuH1qVbCL1JGhKAAoa-DJcKtt7g5GRcQ8hsF8VG0~8UxuVj4gjuWgWMg~LKcdGFlHf-ChhyLCkpnHvQupfDROiL-HBS6Ovg573aNHRONgxNGodl0N~oBF0SkjG4W-8NtjUr2ZtFDUsV3tEE4jxhJefpNRht6sd3oqPh8sDsmxeEHk7znp0dXtDedLHSZcLo~689OLwTXWv2yX8UKvCbpc~FnYrkeTfhBAL1jBXuN6blAjFTCK2cnmpxWtCVLyIJA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 18000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "licor-anisado-canita-375-106",
    "name": "LICOR ANISADO CAÑITA 375",
    "presentation": "375 ml · Media",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 11000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "licor-anisado-canita-750-107",
    "name": "LICOR ANISADO CAÑITA 750",
    "presentation": "750 ml",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 19000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "licor-de-ron-medellin-375-378",
    "name": "LICOR DE RON MEDELLIN 375",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853195/7702049101207.jpg.jpg",
    "price": 27000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "ll-46",
    "name": "ll",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659670901-descarga+%2831%29.jpg?Expires=1795286773&Signature=lgJxA~NAZy02pDJbyqocmO2CT9Ep~S8qjqYERmt2t4gnLPWTtEvUweo6iR8P9JqiWqku-z23PnbpI7JGueLlPTLsUvHvUfgKNngzRlJL82l65o23a76KoThiJt46vyXFWWwXmjRhCoekbKL76GV6yS3c3hJm19hVGz-~dOu8b0aJDmI~OlkJNk6p5bn7O66g9TJr~Mx6LD4njZn3RH4ysrUEEMNG~2ZvNUiFsxs8DcmArgBxtws5ddvYOphsMNA-RcrecXdX3swl5DsjK8ZtSCFP63XgqmZ5n5diHXFxya4XZwsIDlw6IPNtlYE95e07adXnputROvlZoLqfiqeHkA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "macallan-18-anos-750-ml-285",
    "name": "MACALLAN 18 AÑOS 750 ML",
    "presentation": "750 ml",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 844000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "macallan-triple-cask-12-anos-112",
    "name": "MACALLAN TRIPLE CASK 12 AÑOS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147715-descarga+%2814%29.jpg?Expires=1795286774&Signature=CyrL-5Tc3S9~5lrMzFkNRMOQJ6yIkDWKl43IeYGN9gYYw6yvX-J8Q1RgMZEtIR-ip7cI4gt1sG1CiPMNuknqlYPknTxV0ajl2ejCe0dkQqFyMulFOjZ3fUf5JTTtZ7ogwVal5eEseuqNw5637FVCZkLuZPmM95ZtoipvdW3rywOQUQe4gVBxaL3IxbfAbboFHBGnI0uyuEfUGAJkbMqMRmAajowsaZ9RZ2OwHlpuVFj-nmQyPp8~wC4cfsznax5k~xB8dCc-xciYLlhW8y~JWhPTL~wkusXYRUMrcgVvfrwKlE2DvLGvkM79gHeqmg3-rmLKw23eD-LjEejnXy9khw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 250000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "maizena-113",
    "name": "MAIZENA",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147753-descarga+%2815%29.jpg?Expires=1795286774&Signature=djv3TEzr1PZdVPGBZY5xKe49-BfMkW5ypxLgGzGrfmmbF7r1UhuIGfcCdQbjdSo6dQPyE-ZYEtZ8jjuF8mLkC5Ysb4TDUnQ7xhybWqko3Lc-s3K1~lC9sksDQm0dcXE~iK2jM0CQZ2Zjpe49t6xxd0wXz~PqzrzUH8GlQCDz9by4wDX0dAovY0IsLdAwwIcKBCj9ZN~n65zAmPt~8Ze~BQ971rUMFn8yDtDUUT8ubvR1NWVX7lmgF~vaO0KHuSxrGa-nPV9i0jZ7y3VbytCjhksUZVARck9Eqz1mFLweMNtPvJ5e~F7Bz1VQCIzPofc2eYWuA1o6mq6qUOHSVPKMgg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 1000,
    "stock": -4,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "manimoto-salado-114",
    "name": "MANIMOTO SALADO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147791-descarga+%2816%29.jpg?Expires=1795286774&Signature=ExRzu5XmE2ac9iFfDkgGV4mQta9mOhSDYbum-nI1YvyNTjBCuBkqtusObcfmVipBuW1GrYadh2b8QFHxaOCkFRjBMMUGpaX03wFVD7mYa9qgKOPjHCHWDmJeNRk~9oD~ZB4r-Xz4Gd1LhGibSYKDjZ8uVbdFWTg3gzDEx60pAXfa0cywlpvxC7~8uW4SsprOroY27yBbQeQYtVDOYgzBDdLiY9vfw7lZB5FRU3mJJ-r98mQFejIv9Sl3eSl0kdQkE4fsvoznOxWNOlK6WdIKRz5~Q6ycaTblCJGvegR5NX~qCO~SLgtA-0g9SHYX8gOWvH7MFx1Ig9tAezhBCGvJxQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 2000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "margarita-ondulada-105-g-115",
    "name": "MARGARITA ONDULADA 105 G",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147841-descarga+%2817%29.jpg?Expires=1795286774&Signature=qRwVyG5HjCimBTMUBljNWGnMDQMzqU6HPJxpbFWRuewKSfXAriqY6IyqBmVNam5qzocWCGlnwSbqK40vUVbUkpwyZmeVcjw3DH6wZyZyzFQZNiYbqFHiN~m~YUqT~vnkoCTen1gd8jx~lHrJUeXvYdsfMY75xX5943zm8t0~l6tEUEPQf62vVjLSwXiZsLrW1BidiZOsmmXtULeqmpebd2TYqldo9RK9hpjWq2ze~pJPf2ti04ZPMnI9q8BXSg3r1eTFAsgpx0r3PbOL5zIFZo2yqKFDjgghBImFgm3IBSkqx7vUTInxznEWJPefuef3NsIDN57k5Sz-4QLYFhz55Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 6000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "medelli-8-anos-375-269",
    "name": "MEDELLI 8 AÑOS 375",
    "presentation": "375 ml · Media",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 43000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "medellin-12-anos-750-116",
    "name": "MEDELLIN 12 AÑOS 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147888-descarga+%2818%29.jpg?Expires=1795286774&Signature=Ri2MJ2xiTUjrpEQdEWLVSh0axpJgaLO-xvTiEfqB6O773ojblhbCdNWXT-14wrpkaS5sCAS2rdFNTHwZfA4bg8Nqr5pHYCOwcZUJEsDoyweaMHIgW8JgHD3LjHfXEZtavcKAsf10ZeSeBThhC5naIdrin4OQETEJX7Y-bmrPGHpP1rWYER0ElRvxIhlh7I03OW5JUclCTfqlPik38R8R29omC7iR4SsioTn~0UYpFFsUvgkEVJw4EIh~onPRqIWhpWXKzDnoVQUIoq201vSk8YiP5WMqKAIpukZ9LUPeH-OW0roHp95mOAJHOhN9AMJIRZScKiEimZyXGhXhuUmCDQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 79000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "medellin-3-anos-garrafa-119",
    "name": "MEDELLIN 3 AÑOS GARRAFA",
    "presentation": "Garrafa",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148164-descarga+%2821%29.jpg?Expires=1795286774&Signature=XY3NWUp02oBmxyLIiVg6oocym90VTPAL1gIkiDisz81Xw2vzMjcDdKTOo2loQQOPFFOCZxowTJglvOrM9dB76bGtJddPGfU1FbnqwrCIs6ri2y18dJGdnkT5jZx5w~Qy9gj0BHOPmI1G1S7i4LY3Z1UPMFLrh5HmT2Sv5TmA82Aw0eTklxmeDgvRXXqMz39bUF-0~AVrMvM0~YkKf~Kbf5B1QOcLnlZivvjHo3cOl9c7gRv~TLEzOcPMopc3vC~9DqsFAjbIhisloG1zhvBG5xNRfXi1qQ0ibW8JSc-B5peOhFXnj2sPLv5SlI4gmwJZZo0yyIkwPUNE8C2eydWVBw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 130000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "medellin-5-anos-375-267",
    "name": "MEDELLIN 5 AÑOS 375",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680729875-ron-medellin-sa-5-anos-x-375-ml.jpg?Expires=1795286775&Signature=aM81iy8lDFGMM6INm7zHmQJuykx56rDonPwileaR4twjRQI~F-qvRuIt7bg6wG25NIaCGN~Bg9lv4XeELGAmLL8gO0yLrgBzolDHGBuN~28C-ore33tt~KhCHexmanmq-XjXujxAD-D8J3aj2jjKCADBqUbMiCJRu8zg-cy6x6R96y5XoJi3FB0IOZP9tACybFZh~OU3~7SHgHnxgBBRvf4LzJjEMYQznkE-~tAS8Zp9pi04r5INAI6uWYCAzrpd19VbhtR4vQimTzqZBWJPkQS9w561nBg3X7v2Jfa1FHG4o8lmtGxFakz6BZ7xkFckzSHQ5h83leepYPazwSwdTw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 37900,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "medellin-8-anos-750-121",
    "name": "MEDELLIN 8 AÑOS 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148288-descarga+%2823%29.jpg?Expires=1795286775&Signature=iUkhVvBnEqbs5TwOEYvYKr1~FsPfPILh6oSw~GWNQcrQjDviis8W50nDfx~OKdrpJN4CEPe4YTzzr1oUzwwEp2TAIGZRkiFuNsZ5tsptoh78CORg3npY6ncamJVUDQvW3K8ozoAgY4Uamz87q8ThAncXHFKWk2piZ6~CZaD33Vd1Z0nWV0iKIhuwkU3QQZ9ExevHKUMDrw1KCRTLTZ~Wtf6ggaKxnPG8kITlsenY-OlpPEuQOW1gv7cZN0xMf1Nbjj38wcGhAQdbU0ikhx3~brE7zj1Hpo5sP0qCSmqMLbIO~15xEjQ5ZyfXvkhEFk4qBjyLCSWgq6fx6GrzsUDCxw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 75000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "medellin-dorado-750-268",
    "name": "MEDELLIN DORADO 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680730138-PRODUCTOS_diamarket_RON-MEDELLIN-DORADO-750ML-1.jpg?Expires=1795286776&Signature=ZBwviRLVqwyjCo6BOCeet6LtkH0yO7NUKSXKBZwg3TOBSzvDszBmYNf8NYST~Hm7LL7tZFKALKN4xFZUhFLMuqZoN1DdD3fgCsEGjhlyykP2pkhj0urybKwxWqFxWR3R8~s4N8jaM94Bsxs4pwM6F~-6dxoLRJwUa-pOMmuL8rINI6LKfmGmjAjody-oZCPWFGCfMsnjOf99FFY97Le9jjmesaXl6sv9zTL~NC6MSMcbgUEwwrHowlUEt~S~w2eRpryiKmWAA~sO6p0pXDmNefV1gVyWFBTtJGJr84LT5GSA6wNtTkDOWKUFaX2ktBJDSdP~G~JXs9ZYI2gupDW0Aw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 49500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "michelob-ultra-348",
    "name": "MICHELOB ULTRA",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "mikes-lata-und-228",
    "name": "MIKES LATA UND",
    "presentation": "Lata",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148347-descarga+%2824%29.jpg?Expires=1795286776&Signature=quP~o3au6L5n0q78li43GJ4SROjeGnvWk2Huj5yQH9Nzk86NSHAasjHN95WpwsaeP5XovLfVSxyJGCHzHW~l9OupUySrQDWRG5TrWAePO6bXLYWk1NCdi~s6SiVFy6F43xACluYVJxGEfPZUAbPIAYu8Vv~FVG3r4w7Ea30raRJ3pTTPo1wl96kI0XWXzO57OT3jUX3IOVgXIAX604SaFeA1oLPAHD9uKr87BN9Z2kgoVc-BVB2nJK5cMtbmwBPMSYaSb99z8hmkodfjeUj9b8Tq9YKf9FH3EGQ8OX6MOwNG3GTPi1MbNi7S5l4MSe-9qPSNlewCUNlffdXIoC9CdA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "monster-green-lata-123",
    "name": "MONSTER GREEN LATA",
    "presentation": "Lata",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148507-descarga+%2827%29.jpg?Expires=1795286776&Signature=YRrwNOUIlSE4CGg3RJvqwixWrunfZoKi9lRWZt3-RbogurXDEoww4CKXH9FrdluChxXfneFoEuXPaB6DG6JuR7j4UOlGv9wI7Kunr6vcS7ge9sOjZ1YnstvKqjIAXTt6d47ahTWXOAqkpaNTasIFkcjZHADLyuHb0xGoR4AJLevJnzUbgw1Q6hN3gZNqEA2iQCfkRBydM63HSQD6XyiGuSJabnYF6VWtBOJD0-IFncuIzhd~ezwpc-L2xn1i-~2BIZDB~U3hmmtFz6RhnGiPvXBgjlDe7qCgXUtnOYpyI1f4-0BhfbVgHBGQPRKVdiywJtpP6WD6TKzfNasf0gsuFQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "nativa-x-30-botella-350",
    "name": "NATIVA X 30 BOTELLA",
    "presentation": "Botella",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 50000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "old-parr-18-anos-750-125",
    "name": "OLD PARR 18 AÑOS 750",
    "presentation": "750 ml",
    "category": "whisky",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660148795-images+%286%29.jpg?Expires=1795286777&Signature=MYE-WbtJwFL8~TPvIo2uxlLnOrrEUxqwdIfd4KuKjxByF2j001X3H91iBY11lEEaEmV2zVzpQZnzcK-eTMYLMwehacE0U8DtliapKZKeXLRsfUi0PDTO8w8ahDW8pfAcVNiSK0QhhGQDiM6PofKnh33ctOZNgTMzBtimJFRBciFL4EzgZpGZbrUeXoyDTD1mXrH7IQ0allhup-5mx5pgoR8f1Cac1lZktk~ggI8nRLL3tU0CfxhHMnHapI3YgTzxigyFssGJvSRuEpyAn0tdrykKNAD0GyO6bj1YAzCWWGWaBsbmecLmET4LPpFA78wX2dkocP27qkLbPqejJETx7Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 375000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "old-parr-superior-286",
    "name": "OLD PARR SUPERIOR",
    "presentation": "Unidad",
    "category": "whisky",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/2492092/5000281003160_cd5cdf6c25ec4403ad9ca386feedb1cd.webp",
    "price": 370000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "passport-1000-129",
    "name": "PASSPORT 1000",
    "presentation": "1000 ml · Litro",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680727138-Whisky-Passport-1-LT.jpg?Expires=1795286777&Signature=J2mvZ3sBxqhmMgU85xahNZPgcv7mKNtk3ODZB5sPq4MOhsyRI72X-fq~MXOiom~9P9v9jWw6cbczzs1sQrdAKgP43~ld6v58E7tGcqpr5CJFEc2D-hJxAk3UR8m-qZKTjMbJJ8WHHb485AFvHSLfHsr3OsZfEPbBcbgzvmHPf2Q4qiiYKLMiIH85G7gW6M2TMAjuMr63RuGgWBiryUM-nRRZWPdnkEep8OM5YocCdrbviZyeaPjYeLmDOxVqQEcIEbzh~u8jI8vh8AkuRmQ44nEvn5Nu7YG7sSHO1CUapiXe6ISLaF9eD9eIeJITUrRUP6wtPc--6UiSLCvAKpJIaA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 65000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "passport-500-131",
    "name": "PASSPORT 500",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 32000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "passport-700-132",
    "name": "PASSPORT 700",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680727485-PASSPORT+700.jpg?Expires=1795286778&Signature=lnuHLlNF9d-yAANpBgjDs68YM1962krNFCKDssdHssjk0inRKj6TEOlpg8BonCBgI1-6r0KxUbIX2b3AfoDdVfF9ukwU8Rls09gDIHOsfv0lMBQfZqUjlryjAJLtrW7FQlcpE6XEPSC-zhCXDdw-SXg5lWmO~fiwTJ64Z5OnJC5cA782R5HPydxiAShqpQHwp~HCB64oofL7UhPqArgMnOa5z0wQ9MFou66IS9ucXY2CA-4IQj3iftgpt3ewjukU9RVGXiXSZZTKZKrRU6SGt2-9TDmqE0kF35HiLwZeatFS6eXCRzjgaxBtH~FrgpGd0N3RDAqIdyO6~RJtB~WJuA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 58000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "pet-400-manzana-pepsi-gral-133",
    "name": "pet 400 manzana/pepsi GRAL",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "pina-colada-yoniky-134",
    "name": "PIÑA COLADA YONIKY",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 47000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "platanito-135g-grande-374",
    "name": "PLATANITO 135G (GRANDE)",
    "presentation": "Lata",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 10000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "platanito-28g-pequeno-373",
    "name": "PLATANITO 28G (PEQUEÑO)",
    "presentation": "Lata",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "poker-330-x-30-botella-223",
    "name": "POKER 330 X 30 BOTELLA",
    "presentation": "330 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680802840-CAJA+DE+POKER+BOTELLA.jpg?Expires=1795286779&Signature=alHd--9YGPjZDkq5yqcOiO~lnzXKNzuRiEMD2bPdPntM5OsgCYqjS6Dr2zhUmuoV6AdHZmC1Loglq5JYgsV7Nt1nAZTVkLZHYrM3Mjnfy4KJUArApDwtan5VL4lvetzN6oLJ35Vya46Uo1LteoBLMlwn5CegfgqeuZ07zYGs2MyI5aRzI3iP5Z68S-m29k05TYk5wu1kaeCB4NQpPbbJO4P~qv9A8z~6dX7XUi7qkKPONeQfg5kHzeUEihjpILWgIXr91thC-Oa5grnznEzAYcRTgg-MJ1tPuf3PwDSZO0Mzo6csh3AX014BjAFovQ~UwgnmINXlRs52Jlqh2BVVTQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 80000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "poker-x-24-269ml-308",
    "name": "POKER X 24 269ML",
    "presentation": "269 ml",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg",
    "price": 58000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "pony-malta-330-lata-und-312",
    "name": "PONY MALTA 330 LATA UND",
    "presentation": "330 ml",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "pony-malta-botella-und-248",
    "name": "PONY MALTA BOTELLA UND",
    "presentation": "Botella",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "quatro-1-5-lt-137",
    "name": "QUATRO 1.5 LT",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "quatro-p400-138",
    "name": "QUATRO P400",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "reds-lata-269ml-375",
    "name": "REDS LATA 269ML",
    "presentation": "269 ml",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "ron-cana-anejo-375-140",
    "name": "RON CAÑA AÑEJO 375",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147488-descarga+%2811%29.jpg?Expires=1795286780&Signature=k~sUPkMBIIvh16uTjgQiVtKtedNiDKGnEiN5RCmHMuxs8G~AwwN7SzIif9TL69pSQ12JvNHtauY23oNuXMkZgme7kS6hyPssog6sHtBlEkcE~7On6D9JlyEg6oNFXJDfLxLewuPcs32yeXZ-j7d7hzTSBMWuOWu6-VgOybsWBS3zbBtf8kQbGYBbX7XaRXa7dGmSbOluUtVg7yruUnQdrn868~uzPH68w9wntduBAUUUIbjerz8TY~-7vGXuTdymYQiqxGwFfvgluPu7azFBnmy0X5TgLbUl8LP01IZ5U2yOR7T7J5nZOgpiNoIkv0prkqsdCqSY1pOYHUcExtsJ~Q__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 20000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "ron-cana-anejo-750-141",
    "name": "RON CAÑA AÑEJO 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1660147508-descarga+%2810%29.jpg?Expires=1795286780&Signature=IMgqXizDXfk4rDiOGoGanijjoN1z8UiAlut18NeQRf3ZdAvdqp0eMorhl2N~NYcjA9afLJPhVL0X9ppKjlbFwSje30PKMxtqETTAeYNPmGchdDwd3xrXZuo03viXz0sGyvtdcqUzTUWTlYyMCkUoVq3VUC2yeu03gcCfERMzvXBk8lltg-cQY8Rpb54Pvl~ZZ4inCBR38yrm0iuyqcuuAj0f5B0Ju~O081r~UR9Zy3TGpf5C2KVkO-tZV~qcQpCOVhRWDQ1P~s19LBieJTNqbLdbrM-gJxzS5YAP54ArDRUQ~1wAvsFspA~dP5NWN4Pm2c4hIP5bvUVDyGtjV1LQyw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 35000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "ron-medellin-5-anos-750-257",
    "name": "RON MEDELLIN 5 AÑOS 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1686437661-ron-5-a%C3%B1os-sin-az%C3%BAcar-ron-medell%C3%ADn-750ml.jpg?Expires=1795286780&Signature=aWuLEVhWUV1ManbiptIF0qBOoc3vEgq7oHjD4WTPnn1SIpvxl2gmyzS7UhagP2DE8xTdYqDEAbRcXoODM3jkLhAAoVx776nZwRYrOSxDiR7WoFqCudobJXkU4AEMx1qc-~DPzvSaav7Gb1yShUf6-SGGmzRvXnnmYrT-y7aL377H4UjB5hebiY~oXFNtf1WW1IW8MPmW8Q6~QePdo2hQHgvRkXjEzI99IQ-5Bb33B5VPE6AaFwptmXiY6l55YizkCNs4xpqlNZqd2Q8fnsx9uladLVzPIg6z68poCcDlvE6DsOEaW0IKhW3pPEJIG-Drll7cmvd5T20zkdcZhUVE0w__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 63000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "ron-santero-anejo-375-142",
    "name": "RON SANTERO AÑEJO 375",
    "presentation": "375 ml · Media",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680805500-SENTERO+375.jpg?Expires=1795286780&Signature=XgN0nNfZ0en6GuRUkb2LdvFmtfOALn6yul4Zs-DAfPsRSXCtBvRZHc6OVkLt93cTb8kRD4AeUubVg3bbOqJYBigReBxDn~bdw3jFVvCoN~dfrSRo39D8ZroTpzIY4ZMShs8JsY~k4Evq2JY9GCpc-RhxpibRJxVncjF~sKfY6dEI7WO2iOM6OhBcZQvZAn~tVPYr7Lsr4aqrIaMKBO4vBi5EkBbkglWPiiZhCuCHD6zzSnW-0mn-aDq17SxFupEZyL1Dr7f4Er~M1E8Bkg3BhMsRzfgkpnQ5A0LemuhLgn7s1SJiotexwDZckbbc7C9HyfebKB3CVgADkD~IlL-kHg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 22000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "ron-santero-anejo-750-143",
    "name": "RON SANTERO AÑEJO 750",
    "presentation": "750 ml",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680805538-Ron-Blanco-Santero-a%C3%B1ejo-750ml.jpg?Expires=1795286780&Signature=dF1TlqsrLuLX8UuDBg3h17sFL30KyoHzNu27z29FcIZuOAfH2EbEdrlfPAmMVq0sgvfL5wjYo4603DYyN-mKhffltsxycHKHTD1ysfMfgffUNoeFXX7X6kVi5LC0K1WvxJeebnZXvLq6g0IKchtHqsVnou7SRIZGUuT2gJ8rwYZi8mOfdueutRvd5TrhyfWku9k09W22tNNw5OAfRY-1vlbkxtMNfsg0HPyT4znMSP0eE6se0kujV2QuvOmyT-7tDFnJIWc4LG8B-wY7TqvvUiWuF-3BVF1xX8T7xK~aMTXd-9b7cPbnu5K60fKdN8I8q9qMigSHjB96IYFS1nkDBQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 37000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "ron-viejo-de-caldas-8-anos-carta-blanca-147",
    "name": "RON VIEJO DE CALDAS 8 AÑOS CARTA BLANCA",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680806209-Ron+Caldas+8+A%C3%B1os+375ml+CARTA+DE+ORO.jpg?Expires=1795286780&Signature=cwu~6y2EhwcHZrexOwE8RK0spu~1eWUoKcB4XGYUtv7HoZO3~0iyh3QVXwu8UIzfzZg7MkjkGToSOtQoFJbHBlN02eGL9-zEITfZaVpqKKmJfJg9yu9yKZNOaR2xdru-HZ~TAlLgwjbJDjn402SmHax0psJ-tu1vAFMCmVHx5JQrKubcRsM5rbynZ0BXf-zBJhE-6DS3mfTRt3xd47mM6MVDt-c5pHwaxcnWwhSfe3WakwjNZym5VqEwbyFIhCGGk~XZNr-xkY1xwXhuJJ2owkM802~QXwFjBcuJTLJyT8SN5blkfJPaI3CH~B9a5JaAu3xbPb5PsyiO0bQz8R3hmg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 89300,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "ron-viejo-de-caldas-litro-272",
    "name": "RON VIEJO DE CALDAS LITRO",
    "presentation": "1000 ml · Litro",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1490643/7702168217308.jpg",
    "price": 78000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "rotman-economico-389",
    "name": "ROTMAN ECONOMICO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 6000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "sal-de-frutas-lua-148",
    "name": "SAL DE FRUTAS LUA",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 3500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "sello-dorado-150",
    "name": "SELLO DORADO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1686329544-j.walker-gold-label-reserve.jpg?Expires=1795286781&Signature=lhym0Ru6H9AqQATQoYoWNX4EQmFrn4gyK9tAO1bNyi4xuKDk5Mj3OVWRdCCW-EbWAsjWetPqIsDXjFYAwmhfafneAe10hunDhM4bdIJIL5kvvzwjWN7Sw5x9CPWBw07rnc3f~i5uGl0GoXqmaWcOug2tznxwwzQU37C1YRNtgpjbIkQJHyRi5g48lFBDw2ePSPVa8O26f1hUNMPv0iVQEc0uDlS4iqZFn2PzcdX0P~PiYELbf2AOpEgxcBhAkVV2iovcEVqQKekJIgjacQv1~apf5en0TGpDInK73Sjr1J4XOPE0aqwEtyMOdjy22qoczmAEUJn-3VaXXIuubEXmLA__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 265000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "sello-rojo-375-ml-259",
    "name": "SELLO ROJO 375 ML",
    "presentation": "375 ml · Media",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680732161-whisky-red-label-sello-rojo-375-ml.jpg?Expires=1795286782&Signature=K04A6DX-dPqyI1qHTRivGJEcsJErK0kaUn5Ezg2qw97j66h22lddpoc17RdqdCJ10sJ8QAMV5WcTJd4m~NIMAGjIPAmMzRMvGCKnYt~HDkcKMbfpp9E21q4tlUxKWPW7gyqHoQpAhTu1W2xqlMkaxNF2kqqM5DoPUT0qxCXHpYJiUYPwrQsHOYifcNIx-IipamGQrGBiCXaS-yADC6HSd-2clmLvlNKwdE5KF-E3Y2mBV8aiYUPI83B01W4-HNMLNQN-Et1IW6yF2-X0eRvkFxYV3GNZBY99dcV2C1rTH~xbb23PXjqgTxmRTcgVrNxqD5OxXbIWk50lU5qYkdvd0w__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 43000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "smirnoff-750-ml-lulo-155",
    "name": "SMIRNOFF 750 ML LULO",
    "presentation": "750 ml",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680730651-VODKA-SMIRNOFF-X1-750-ML-Web-1024x1024-1.jpg?Expires=1795286783&Signature=P9oFJkzioeIKT88QxsfwbuquEj8crqYjmAJe-nKOUXNMCSe6mj2EPgcytIuv9u1vzNMf4Q4T-4DNNJ1nA1q9mXMPYs2l1P1VDXnVUjkKj8AWpr-iEQY~nUqHeN5rpSwumJuW0AWQkekrNSLdDGVS0lyWKMEYRUSHfnLG525ifjJ33gf9iCOUw4S5IrFOqgBqr0k8kZt5cJLWJoa50PEXZ1Gl6lSR~9Laavfr4zhzmnJtl3k-pIGuE-CTVi4U9Q7qFhXUXZJtmPMzrFaWSp73iro4G1HQzQGarGrECWnOAVbteC5d4uaYU2afKh7N-Sr6A0TK1OGyLrlwBdKRtlhigw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 52000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "smirnoff-blue-blue-258",
    "name": "SMIRNOFF BLUE BLUE",
    "presentation": "Unidad",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/642412/7312040017355.jpg",
    "price": 7000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "smirnoff-lulo-375-158",
    "name": "SMIRNOFF LULO 375",
    "presentation": "375 ml · Media",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1659667681-descarga+%287%29.jpg?Expires=1795286783&Signature=daKk-2F7rOfgHg~d4qX7FHgto~ynMCHlst-iStIU~gdazfA8E0fID-6WdjfXMxFAtNIg8nZ-1xb2T2ok6XLP3FcMc7Ui88diDxBX9aU7w1vNUN1nB3bZy0bw830qhIbktYqznu0S9AaoVyOLEYLkB7B3n9AYjlqmOQSpGVcQYE5UzF4uQOg5H8zobjpQpXY7AiRHaE0EXwNTEney7QgeN~ryCgHZxLvNGyev47BKqvgSY9Fyybsn7BtMTQlJGNS8Jfl~mleRvnJok5hFLlFmlWEmP8pNWWANAmFnTgfbODjWOYYgVtwwz3WR7APqcspfv5a1TnOEU6m0Xy3h8zGjgg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 29000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "smirnoff-lulo-litro-tetra-244",
    "name": "SMIRNOff LULO LITRO TETRA",
    "presentation": "1000 ml · Litro",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1681339480-7707096289946.jpg?Expires=1795286783&Signature=ROX1frrmDH6KG6xTNmxjQIm-SYLDHOQ3JmUQjqaupNHJcoVMtaIQEQLSRqQ23MQeoA76Jeu3zy7df5wmClANIjAFn34FH7yVWA68BxT3LU9dMOBAhaHqQtuQB1xxOU7LWH3ZuywlK~XowBBWR1rz9~9Ofp6KAgkL~25TXDd60FN~1f7DQOaRsybY-p9M-McGbh9i3jxo19XCMkrXdTEBgnD5aEV~P0O~CW4E2IgDWV-mYwATkas2JqlrwlLz8bd2SqKqo0rbfbiv1dp2PwSYTWLwWWzpcLiDf9cbnpB5dZIQYmQidQEuUDwElszatQkUbdZ0C3U5FjZ-c3VjBRMZbQ__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 55000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "smirnoff-red-lata-159",
    "name": "SMIRNOFF RED LATA",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/642412/7312040017355.jpg",
    "price": 7500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "smirnoof-red-vodka-700ml-160",
    "name": "SMIRNOOF RED VODKA 700ML",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 75000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "sol-330-und-163",
    "name": "SOL 330 UND",
    "presentation": "330 ml",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "somethin-special-de-litro-164",
    "name": "SOMETHIN SPECIAL DE LITRO",
    "presentation": "1000 ml · Litro",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680731510-SOMETHING+LT.jpg?Expires=1795286784&Signature=R8OYltyE-IhO~PWDyN97KNotjAm7qOKhZLUDh8SMCqJhVuoubJhsnBphM6S-soMBybOgDqTRge3QauZRTNie7L4ioJGmvaNXDmogaoYk2p6Izuq28zvYESw0NgxdBLCrH2kTp77G8tux5Mg3NB5d2PZrS0AOjm7C~Hx~ZkXP8J24oD6D74lOPaUIaxdVOQfBtA38nyz8~CyUvPQggwJdzfrQTJJggZieKkqAYycsqcfb7Ms-o-Ar1jDV~TgVcG-V2Qs015lhLVFx8FdFTHmidcfrx7GqQu0aLkdulq6uE9ryqkUAQpThq4okz7SgXQXl8iAugSag25adgeheAGI1-A__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 93000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "something-special-750-165",
    "name": "SOMETHING SPECIAL 750",
    "presentation": "750 ml",
    "category": "otros",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680731582-whisky-sometihng-special-750-ml.jpg?Expires=1795286784&Signature=IcsCy7vCp9eGAm3JcCCmA7LteZnhhHofyYqOPBBnjlE~HRhP~GuTuSXHbAvUmF7cW78V1KiDo8yj0ghnJejvpbM9F8woItqZJtNOWC9FOOa7NDfcmUSj-Agz6fdTVL0KX8VHLmJQJyRBqVAXkAtpplqlYVx0wHo1OE6miCtsMTnaRkcxOagBSWSdxwz7Dwb~sRmLlD8G2wh2rx1qO1kq0YEEeGFJjcckozeP6j7UhCX0Z8XW-grHqT3BcrRs9MllDkWrSvRu8iWeGc2ZUS1umBHW5Q~TfwkOZCj8CkmqUCrAoWgGWCiNUlYLY~bsiW2vQdRCnKOXfxHKG8Ozq37Jpw__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 77000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "speed-max-166",
    "name": "SPEED MAX",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "sprite-400ml-167",
    "name": "SPRITE 400ML",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 2500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "stella-lata-und-169",
    "name": "STELLA LATA UND",
    "presentation": "Lata",
    "category": "cervezas",
    "imageUrl": "https://cdn3.alegra.com/48270eb512f20da78fca843466208e0861938450-1680892528-stella+lata+und.jpeg?Expires=1795286784&Signature=BkI9N4cxw3mWXJrD5PWjErNH1-TkYbNlABYn2N2KxSES2ZbDsRGO55HaTrTMvtArjB9JXKz7MTKwdMKySynrT~YqlnO0~VzQ83oMD2r3eY1CsDRSxWky7yxOMXB~nm3fvDQAJIB8mdVJgzoM7EfRx-mK843YezuKF5YqXziXHVKY~DqyEidSz1Ek399grlSAz9oMzgUyF2uS8-VIEltHPgWyN36B3R0ooA~iMVYBI~O16Wopb09pPdCFN9H2hw6dlmKJJ0xubICH5GzOlYchsF9qXgCyfJNyOh0wAug8-buCsNED4sLkoCnXw5g7~7jndJvn-GOt~S-FCbkEnKR1Sg__&Key-Pair-Id=APKAJU3VE62QBWZP27QQ",
    "price": 4500,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "tequila-casador-reposao-750-170",
    "name": "TEQUILA CASADOR REPOSAO 750",
    "presentation": "750 ml",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 90000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "tequila-patron-reposao-50-cc-171",
    "name": "TEQUILA PATRON REPOSAO 50 CC",
    "presentation": "Unidad",
    "category": "aguardiente-ron",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 28000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "the-glenlivet-founders-172",
    "name": "THE GLENLIVET FOUNDERS",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 160000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "today-173",
    "name": "TODAY",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 5000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vapeador-vuse-176",
    "name": "VAPEADOR VUSE",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 27000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vino-embajador-cabernet-sauvignon-177",
    "name": "VINO EMBAJADOR CABERNET SAUVIGNON",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 27000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vino-embajador-merlot-178",
    "name": "VINO EMBAJADOR MERLOT",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 27000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vino-embajador-vino-tinto-179",
    "name": "VINO EMBAJADOR VINO TINTO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 27000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vino-gato-negro-tinto-semi-sweet-263",
    "name": "VINO GATO NEGRO TINTO SEMI SWEET",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 49000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vino-la-huerta-tinto-merlot-262",
    "name": "VINO LA HUERTA TINTO MERLOT",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 50000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vino-merlot-gatop-negro-180",
    "name": "VINO MERLOT GATOP NEGRO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 38000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vino-san-pedro-gato-negro-264",
    "name": "VINO SAN PEDRO GATO NEGRO",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 51000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vino-tinto-rosaleda-261",
    "name": "VINO TINTO ROSALEDA",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 36000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vitafer-l-gold-181",
    "name": "VITAFER-L GOLD",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 35000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vodka-absolut-1000-ml-182",
    "name": "VODKA ABSOLUT 1000 ML",
    "presentation": "1000 ml · Litro",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/642412/7312040017355.jpg",
    "price": 97000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "vodka-absolut-700-ml-183",
    "name": "VODKA ABSOLUT 700 ML",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/642412/7312040017355.jpg",
    "price": 75000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  },
  {
    "id": "votl-energizante-256",
    "name": "VOTL ENERGIZANTE",
    "presentation": "Unidad",
    "category": "otros",
    "imageUrl": "https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg",
    "price": 3000,
    "stock": 0,
    "min_stock": 6,
    "reorder_qty": 12,
    "active": 1,
    "sort_order": 250
  }
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.shipday.com https://api.cloudflare.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function withSecurityHeaders(response) {
  if (!response) return response;
  const newHeaders = new Headers(response.headers);
  for (const [key, val] of Object.entries(SECURITY_HEADERS)) {
    if (!newHeaders.has(key)) {
      newHeaders.set(key, val);
    }
  }
  const status = response.status;
  const hasNoBody = status === 204 || status === 205 || status === 304;
  return new Response(hasNoBody ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

// --- Rate Limiting para Login y Autenticación (5 intentos por 15 min) ---
const loginAttemptsMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function getClientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

async function checkLoginRateLimit(ip, env) {
  const now = Date.now();

  // 1. Check in-memory map
  const record = loginAttemptsMap.get(ip);
  if (record) {
    if (record.blockedUntil && now < record.blockedUntil) {
      return { allowed: false, remainingMs: record.blockedUntil - now };
    }
    if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
      loginAttemptsMap.delete(ip);
    } else if (record.count >= MAX_FAILED_ATTEMPTS) {
      record.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
      return { allowed: false, remainingMs: RATE_LIMIT_WINDOW_MS };
    }
  }

  // 2. Check D1 distributed store
  if (env && env.DB) {
    try {
      const row = await env.DB.prepare(
        'SELECT count, first_attempt, blocked_until FROM rate_limits WHERE key = ?'
      ).bind(`login:${ip}`).first();
      if (row) {
        if (row.blocked_until && now < row.blocked_until) {
          return { allowed: false, remainingMs: row.blocked_until - now };
        }
        if (now - row.first_attempt > RATE_LIMIT_WINDOW_MS) {
          await env.DB.prepare('DELETE FROM rate_limits WHERE key = ?').bind(`login:${ip}`).run();
        } else if (row.count >= MAX_FAILED_ATTEMPTS) {
          await env.DB.prepare(
            'UPDATE rate_limits SET blocked_until = ? WHERE key = ?'
          ).bind(now + RATE_LIMIT_WINDOW_MS, `login:${ip}`).run();
          return { allowed: false, remainingMs: RATE_LIMIT_WINDOW_MS };
        }
      }
    } catch {
      // Fallback a mapa en memoria si D1 no responde
    }
  }

  return { allowed: true };
}

async function recordFailedLogin(ip, env) {
  const now = Date.now();

  // 1. Update in-memory map
  let record = loginAttemptsMap.get(ip);
  if (!record || now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    record = { count: 1, firstAttempt: now, blockedUntil: 0 };
    loginAttemptsMap.set(ip, record);
  } else {
    record.count += 1;
    if (record.count >= MAX_FAILED_ATTEMPTS) {
      record.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    }
  }

  // 2. Update D1 distributed store
  if (env && env.DB) {
    try {
      const row = await env.DB.prepare(
        'SELECT count, first_attempt FROM rate_limits WHERE key = ?'
      ).bind(`login:${ip}`).first();

      if (!row || now - row.first_attempt > RATE_LIMIT_WINDOW_MS) {
        await env.DB.prepare(
          'INSERT OR REPLACE INTO rate_limits (key, count, first_attempt, blocked_until) VALUES (?, 1, ?, 0)'
        ).bind(`login:${ip}`, now).run();
      } else {
        const newCount = row.count + 1;
        const blockedUntil = newCount >= MAX_FAILED_ATTEMPTS ? now + RATE_LIMIT_WINDOW_MS : 0;
        await env.DB.prepare(
          'UPDATE rate_limits SET count = ?, blocked_until = ? WHERE key = ?'
        ).bind(newCount, blockedUntil, `login:${ip}`).run();
      }
    } catch {
      // Fallback silencioso si D1 no está configurado
    }
  }
}

async function resetLoginRateLimit(ip, env) {
  if (env && env.DB) {
    try {
      await env.DB.prepare('DELETE FROM rate_limits WHERE key = ?').bind(`login:${ip}`).run();
    } catch {}
  }
  loginAttemptsMap.delete(ip);
}

// --- Comparación en tiempo constante y utilidades de saneamiento ---
async function timingSafeEqualString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const enc = new TextEncoder();
  const aBuf = enc.encode(a);
  const bBuf = enc.encode(b);
  const hashA = new Uint8Array(await crypto.subtle.digest('SHA-256', aBuf));
  const hashB = new Uint8Array(await crypto.subtle.digest('SHA-256', bBuf));

  if (crypto?.subtle?.timingSafeEqual) {
    try {
      return crypto.subtle.timingSafeEqual(hashA, hashB);
    } catch {}
  }
  if (crypto?.timingSafeEqual) {
    try {
      return crypto.timingSafeEqual(hashA, hashB);
    } catch {}
  }
  let diff = 0;
  for (let i = 0; i < hashA.length; i++) {
    diff |= hashA[i] ^ hashB[i];
  }
  return diff === 0;
}

function sanitizeRedirectPath(target, fallback = '/admin.html') {
  if (!target || typeof target !== 'string') return fallback;
  const trimmed = target.trim().replace(/[\r\n\t]/g, '');
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.includes(':') ||
    trimmed.includes('\\')
  ) {
    return fallback;
  }
  if (!/^\/[a-zA-Z0-9_\-\./?=&%#]*$/.test(trimmed)) {
    return fallback;
  }
  return trimmed;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// --- Firma y Verificación HMAC-SHA256 con Roles ---
async function signToken(username, role = 'admin', env) {
  const secret = (env && env.TOKEN_SECRET) || '';
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${username}:${role}:${exp}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const sigHex = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return btoa(`${payload}:${sigHex}`);
}

async function verifyRawToken(token, env) {
  if (!token) return null;
  const secret = (env && env.TOKEN_SECRET) || '';
  if (!secret) return null;
  try {
    const decoded = atob(token);
    const parts = decoded.split(':');
    let username, role, expStr, sigHex, payload;
    if (parts.length === 3) {
      // Legacy format: username:exp:sigHex
      [username, expStr, sigHex] = parts;
      role = (username === 'cajero' || username === CASHIER_USER) ? 'cajero' : 'admin';
      payload = `${username}:${expStr}`;
    } else if (parts.length === 4) {
      // Role format: username:role:exp:sigHex
      [username, role, expStr, sigHex] = parts;
      payload = `${username}:${role}:${expStr}`;
    } else {
      return null;
    }

    if (!username || !expStr || !sigHex) return null;
    if (Date.now() > Number(expStr)) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
    const expectedHex = Array.from(new Uint8Array(sigBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const expectedBytes = enc.encode(expectedHex);
    const sigBytes = enc.encode(sigHex);
    if (expectedBytes.byteLength !== sigBytes.byteLength) return null;

    let isMatch = false;
    if (crypto?.subtle?.timingSafeEqual) {
      try {
        isMatch = crypto.subtle.timingSafeEqual(expectedBytes, sigBytes);
      } catch {}
    }
    if (!isMatch && crypto?.timingSafeEqual) {
      try {
        isMatch = crypto.timingSafeEqual(expectedBytes, sigBytes);
      } catch {}
    }
    if (!isMatch) {
      let diff = 0;
      for (let i = 0; i < expectedBytes.length; i++) {
        diff |= expectedBytes[i] ^ sigBytes[i];
      }
      isMatch = diff === 0;
    }
    if (!isMatch) return null;
    return { username, role: role || (username === 'cajero' ? 'cajero' : 'admin') };
  } catch {
    return null;
  }
}

function getCookieValue(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return '';
}

async function verifySession(request, env) {
  // 1. Verificar Cookie HttpOnly (prioritario)
  const cookieToken = getCookieValue(request, COOKIE_NAME);
  if (cookieToken) {
    const user = await verifyRawToken(cookieToken, env);
    if (user) return user;
  }
  // 2. Fallback a cabecera Authorization: Bearer
  const authHeader = request.headers.get('Authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (bearerToken) {
    return await verifyRawToken(bearerToken, env);
  }
  return null;
}


// --- Pantalla de Login Renderizada en Servidor (Nadie sin sesión ve el código del Admin/POS) ---
function renderServerLoginPage(redirectTo = '/admin.html', errorMsg = '', customStatus = null) {
  const html = `<!DOCTYPE html>
<html lang="es-CO">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acceso Administrativo · Mucadele Licores</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
  <link rel="apple-touch-icon" sizes="192x192" href="/assets/favicon-192.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FFFFFF;
      --surface: #F5F5F7;
      --border: #E5E5EA;
      --text: #111111;
      --muted: #52525B;
      --action: #034d27;
      --action-active: #02361b;
      --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100dvh;
      display: grid;
      place-items: center;
      padding: 1.25rem;
      background: var(--surface);
      color: var(--text);
      font-family: var(--font);
      -webkit-font-smoothing: antialiased;
    }
    .login-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem 1.75rem;
      width: 100%;
      max-width: 400px;
    }
    .badge {
      display: inline-block;
      background: var(--text);
      color: var(--bg);
      font-size: 0.74rem;
      font-weight: 800;
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      letter-spacing: 0.04em;
      margin-bottom: 0.6rem;
    }
    h1 {
      margin: 0 0 0.35rem 0;
      font-size: 1.35rem;
      font-weight: 800;
    }
    p.sub {
      margin: 0 0 1.35rem 0;
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.45;
    }
    form {
      display: grid;
      gap: 0.95rem;
    }
    label {
      display: block;
      font-size: 0.84rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }
    input[type="text"],
    input[type="password"] {
      width: 100%;
      height: 46px;
      padding: 0 0.9rem;
      border-radius: 10px;
      border: 1.5px solid var(--border);
      font-family: var(--font);
      font-size: 1rem;
      color: var(--text);
      background: var(--bg);
    }
    input:focus {
      outline: none;
      border-color: var(--text);
    }
    .error-banner {
      background: #FEE2E2;
      border: 1px solid #FECACA;
      color: #991B1B;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      font-size: 0.86rem;
      font-weight: 700;
    }
    button.submit-btn {
      height: 48px;
      border: none;
      border-radius: 10px;
      background: var(--action);
      color: #fff;
      font-family: var(--font);
      font-size: 0.98rem;
      font-weight: 800;
      cursor: pointer;
      margin-top: 0.25rem;
    }
    .pass-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }
    .pass-head label { margin: 0; }
    .toggle-btn {
      background: none;
      border: none;
      color: var(--action);
      font-family: var(--font);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
    }
  </style>
</head>
<body>
  <main class="login-card">
    <div style="text-align:center;margin-bottom:1.5rem;">
      <img src="/assets/logo-mucadele-transparente.png" alt="Mücadele Licores" style="height:62px;width:auto;object-fit:contain;margin-bottom:0.75rem;display:inline-block;">
      <br>
      <span class="badge">ACCESO RESTRINGIDO</span>
      <p class="sub" style="margin:0.5rem 0 0 0;">Consola de Administración y Punto de Venta (POS)</p>
    </div>
    ${errorMsg ? `<div class="error-banner" role="alert">${escapeHtml(errorMsg)}</div>` : ''}
    <form method="POST" action="/api/login">
      <input type="hidden" name="redirect" value="${escapeHtml(sanitizeRedirectPath(redirectTo, '/admin.html'))}">
      <div>
        <label for="username">Usuario</label>
        <input
          type="text"
          id="username"
          name="username"
          autocomplete="username"
          required
          autofocus
        >
      </div>
      <div>
        <div class="pass-head">
          <label for="current-password">Contraseña</label>
          <button type="button" class="toggle-btn" onclick="const p=document.getElementById('current-password');const s=p.type==='password';p.type=s?'text':'password';this.textContent=s?'Ocultar':'Mostrar';">Mostrar</button>
        </div>
        <input
          type="password"
          id="current-password"
          name="password"
          autocomplete="current-password"
          required
        >
      </div>
      <button type="submit" class="submit-btn">Iniciar sesión</button>
    </form>
  </main>
</body>
</html>`;

  const status = customStatus || (errorMsg ? 401 : 200);
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      ...SECURITY_HEADERS,
    },
  });
}


function formatBogotaDateAndTime(offsetMinutes = 35) {
  const now = new Date(Date.now() + offsetMinutes * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

function normalizeColombianPhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D+/g, '');
  if (!digits) return '+573015153867';
  if (digits.startsWith('57') && digits.length >= 12) {
    return `+${digits}`;
  }
  return `+57${digits.slice(-10)}`;
}

function getShipdayHeaders(env) {
  const apiKey = (env && env.SHIPDAY_API_KEY) || '';
  return {
    Authorization: `Basic ${apiKey}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

// --- Login Form Handler (/api/login y /api/logout) ---
async function handleServerLogin(request, env) {
  if (request.method !== 'POST') {
    return Response.redirect(new URL('/admin.html', request.url).toString(), 303);
  }

  const clientIp = getClientIp(request);

  let username = '';
  let password = '';
  let redirectTo = '/admin.html';
  let isJsonRequest = false;

  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    isJsonRequest = true;
    const body = await request.json().catch(() => ({}));
    username = String(body.username || '').trim();
    password = String(body.password || '').trim();
    redirectTo = String(body.redirect || '/admin.html');
  } else {
    const formData = await request.formData().catch(() => null);
    if (formData) {
      username = String(formData.get('username') || '').trim();
      password = String(formData.get('password') || '').trim();
      redirectTo = String(formData.get('redirect') || '/admin.html');
    }
  }

  const safeRedirect = sanitizeRedirectPath(redirectTo, '/admin.html');
  const expectedAdminUser = (env && env.ADMIN_USER) || ADMIN_USER;
  const expectedAdminPass = (env && env.ADMIN_PASS) || '';
  const expectedCashierUser = (env && env.CASHIER_USER) || CASHIER_USER;
  const expectedCashierPass = (env && env.CASHIER_PASS) || DEFAULT_CASHIER_PASS;

  let authUser = null;
  let authRole = null;

  if (username === expectedAdminUser && expectedAdminPass && (await timingSafeEqualString(password, expectedAdminPass))) {
    authUser = expectedAdminUser;
    authRole = 'admin';
  } else if (username === expectedCashierUser && (await timingSafeEqualString(password, expectedCashierPass))) {
    authUser = expectedCashierUser;
    authRole = 'cajero';
  }

  if (authUser && authRole) {
    await resetLoginRateLimit(clientIp, env);
    const token = await signToken(authUser, authRole, env);
    let targetRedirect = safeRedirect;
    if (authRole === 'cajero') {
      if (targetRedirect.includes('admin') || targetRedirect === '/' || !targetRedirect) {
        targetRedirect = '/pos.html';
      }
    }
    const cookieStr = `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;
    if (isJsonRequest || request.headers.get('Accept')?.includes('application/json')) {
      return jsonResponse(
        { ok: true, user: authUser, role: authRole, token, redirect: targetRedirect },
        200,
        {
          'Set-Cookie': cookieStr,
          Location: targetRedirect,
        }
      );
    }
    return new Response(null, {
      status: 303,
      headers: {
        Location: targetRedirect,
        'Set-Cookie': cookieStr,
        'Cache-Control': 'no-store',
      },
    });
  }

  const rateLimit = await checkLoginRateLimit(clientIp, env);
  if (!rateLimit.allowed) {
    const errorMsg = 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.';
    return jsonResponse({ ok: false, error: errorMsg }, 429, { 'Retry-After': '900' });
  }

  await recordFailedLogin(clientIp, env);
  const errorMsg = 'Usuario o contraseña incorrectos.';
  if (isJsonRequest || request.headers.get('Accept')?.includes('application/json')) {
    return jsonResponse({ ok: false, error: errorMsg }, 401);
  }
  return renderServerLoginPage(safeRedirect, errorMsg, 401);
}

function handleServerLogout(request) {
  const url = new URL(request.url);
  const nextParam = url.searchParams.get('next');
  const safeNext = sanitizeRedirectPath(nextParam, '/admin.html');
  return new Response(null, {
    status: 303,
    headers: {
      Location: safeNext,
      'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
      'Cache-Control': 'no-store',
    },
  });
}

// --- JSON Auth Handler (/api/auth) ---
async function handleAuth(request, env) {
  if (request.method === 'GET') {
    const user = await verifySession(request, env);
    if (!user) return jsonResponse({ ok: false, error: 'Sesión no válida o expirada' }, 401);
    const username = typeof user === 'string' ? user : user.username;
    const role = typeof user === 'string' ? (user === 'cajero' ? 'cajero' : 'admin') : (user.role || 'admin');
    return jsonResponse({ ok: true, user: username, role });
  }

  if (request.method === 'POST') {
    const clientIp = getClientIp(request);

    let body = {};
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: 'Solicitud inválida' }, 400);
    }
    const username = String(body.username || '').trim();
    const password = String(body.password || '').trim();

    const expectedAdminUser = (env && env.ADMIN_USER) || ADMIN_USER;
    const expectedAdminPass = (env && env.ADMIN_PASS) || '';
    const expectedCashierUser = (env && env.CASHIER_USER) || CASHIER_USER;
    const expectedCashierPass = (env && env.CASHIER_PASS) || DEFAULT_CASHIER_PASS;

    let authUser = null;
    let authRole = null;

    if (username === expectedAdminUser && expectedAdminPass && (await timingSafeEqualString(password, expectedAdminPass))) {
      authUser = expectedAdminUser;
      authRole = 'admin';
    } else if (username === expectedCashierUser && (await timingSafeEqualString(password, expectedCashierPass))) {
      authUser = expectedCashierUser;
      authRole = 'cajero';
    }

    if (authUser && authRole) {
      await resetLoginRateLimit(clientIp, env);
      const token = await signToken(authUser, authRole, env);
      const cookieStr = `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;
      return jsonResponse(
        { ok: true, user: authUser, role: authRole, token, redirect: authRole === 'cajero' ? '/pos.html' : '/admin.html' },
        200,
        { 'Set-Cookie': cookieStr }
      );
    }

    const rateLimit = await checkLoginRateLimit(clientIp, env);
    if (!rateLimit.allowed) {
      return jsonResponse(
        { ok: false, error: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.' },
        429,
        { 'Retry-After': '900' }
      );
    }

    await recordFailedLogin(clientIp, env);
    return jsonResponse({ ok: false, error: 'Usuario o contraseña incorrectos.' }, 401);
  }

  return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
}


// --- Catalog Handler (/api/catalog) ---
async function handleCatalog(request, env) {
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all') === '1';

  // Si pide todos los productos (incluidos los ocultos), exigir sesión de admin
  if (showAll) {
    const user = await verifySession(request, env);
    if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  }

  if (env && env.DB) {
    try {
      const sql = showAll
        ? `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone
           FROM products p
           LEFT JOIN suppliers s ON p.supplier_id = s.id
           ORDER BY p.sort_order ASC, p.name ASC`
        : `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone
           FROM products p
           LEFT JOIN suppliers s ON p.supplier_id = s.id
           WHERE p.active = 1
           ORDER BY p.sort_order ASC, p.name ASC`;
      const { results } = await env.DB.prepare(sql).all();
      if (Array.isArray(results)) {
        return jsonResponse({
          ok: true,
          source: 'd1',
          products: results.map((p) => ({
            id: p.id,
            name: p.name,
            presentation: p.presentation,
            category: p.category,
            imageUrl: p.imageUrl,
            price: Number(p.price),
            stock: Number(p.stock ?? 0),
            min_stock: Number(p.min_stock ?? 6),
            reorder_qty: Number(p.reorder_qty ?? 12),
            supplier_id: p.supplier_id ? Number(p.supplier_id) : null,
            supplier_name: p.supplier_name || 'Sin proveedor asignado',
            supplier_phone: p.supplier_phone || '',
            active: Number(p.active ?? 1) === 1,
            sort_order: Number(p.sort_order ?? 100),
          })),
        });
      }
    } catch {}
  }

  const list = showAll ? DEFAULT_CATALOG : DEFAULT_CATALOG.filter((p) => p.active === 1);
  return jsonResponse({
    ok: true,
    source: 'fallback',
    products: list.map((p) => ({
      ...p,
      min_stock: 6,
      reorder_qty: 12,
      supplier_id: null,
      supplier_name: 'Sin proveedor',
      active: Boolean(p.active),
    })),
  });
}

// --- Auto-generador de Pedido Programado a Proveedor cuando Stock <= Min_Stock ---
async function checkAndTriggerAutoReorder(env, productIds = []) {
  if (!env || !env.DB || !Array.isArray(productIds) || productIds.length === 0) return [];
  const generatedPOs = [];
  try {
    // Obtener órdenes de compra activas ('enviada') para no duplicar pedidos del mismo producto
    const activePOsRes = await env.DB.prepare(
      "SELECT items_json FROM purchase_orders WHERE status = 'enviada'"
    ).all();
    const pendingProductIds = new Set();
    for (const row of activePOsRes.results || []) {
      try {
        const parsed = JSON.parse(row.items_json || '[]');
        for (const it of parsed) {
          if (it.id) pendingProductIds.add(it.id);
        }
      } catch {}
    }

    for (const pid of productIds) {
      if (!pid || pendingProductIds.has(pid)) continue;
      const prod = await env.DB.prepare(
        `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone
         FROM products p
         LEFT JOIN suppliers s ON p.supplier_id = s.id
         WHERE p.id = ?`
      )
        .bind(pid)
        .first();

      if (!prod) continue;
      const currentStock = Number(prod.stock ?? 0);
      const minStock = Number(prod.min_stock ?? 6);
      const reorderQty = Math.max(1, Number(prod.reorder_qty ?? 12));

      if (currentStock <= minStock) {
        const poNumber = `OC-AUTO-${Date.now().toString().slice(-6)}`;
        const supplierId = prod.supplier_id ? Number(prod.supplier_id) : null;
        const supplierName = prod.supplier_name || 'Proveedor General';
        const supplierPhone = prod.supplier_phone || '+573015153867';
        const itemsPayload = [
          {
            id: prod.id,
            name: prod.name,
            presentation: prod.presentation,
            current_stock: currentStock,
            min_stock: minStock,
            qty: reorderQty,
          },
        ];

        await env.DB.prepare(
          `INSERT INTO purchase_orders (po_number, supplier_id, supplier_name, supplier_phone, items_json, total_units, status)
           VALUES (?, ?, ?, ?, ?, ?, 'enviada')`
        )
          .bind(
            poNumber,
            supplierId,
            supplierName,
            supplierPhone,
            JSON.stringify(itemsPayload),
            reorderQty
          )
          .run();

        pendingProductIds.add(pid);
        generatedPOs.push({
          poNumber,
          productName: prod.name,
          supplierName,
          qty: reorderQty,
        });
      }
    }
  } catch {}
  return generatedPOs;
}

// --- Admin Products CRUD (/api/admin/products) ---
async function handleAdminProducts(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  if (!isAdminUser(user)) {
    return jsonResponse({ ok: false, error: 'Acceso denegado: El usuario cajero solo tiene permisos para vender y no puede manipular inventarios ni modificar precios.' }, 403);
  }
  if (!env || !env.DB) return jsonResponse({ ok: false, error: 'Base de datos D1 no vinculada.' }, 500);

  const url = new URL(request.url);

  if (request.method === 'DELETE') {
    const id = (url.searchParams.get('id') || '').trim();
    if (!id) return jsonResponse({ ok: false, error: 'Falta el ID del producto a eliminar.' }, 400);
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true, deletedId: id });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido.' }, 400);
  }

  if (request.method === 'PATCH') {
    const id = String(body.id || '').trim();
    if (!id) return jsonResponse({ ok: false, error: 'Falta ID del producto.' }, 400);

    const existing = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    if (!existing) return jsonResponse({ ok: false, error: 'Producto no encontrado.' }, 404);

    const newStock = body.stock !== undefined ? Math.max(0, Number(body.stock) || 0) : existing.stock;
    const newPrice = body.price !== undefined ? Math.max(0, Number(body.price) || 0) : existing.price;
    const newMinStock =
      body.min_stock !== undefined ? Math.max(0, Number(body.min_stock) || 0) : Number(existing.min_stock ?? 6);
    const newReorderQty =
      body.reorder_qty !== undefined ? Math.max(1, Number(body.reorder_qty) || 12) : Number(existing.reorder_qty ?? 12);
    const newSupplierId =
      body.supplier_id !== undefined
        ? body.supplier_id
          ? Number(body.supplier_id)
          : null
        : existing.supplier_id;
    const newActive = body.active !== undefined ? (body.active ? 1 : 0) : existing.active;

    await env.DB.prepare(
      'UPDATE products SET stock = ?, price = ?, min_stock = ?, reorder_qty = ?, supplier_id = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(newStock, newPrice, newMinStock, newReorderQty, newSupplierId, newActive, id)
      .run();

    const autoPOs = await checkAndTriggerAutoReorder(env, [id]);

    const updatedRow = await env.DB.prepare(
      `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone
       FROM products p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.id = ?`
    )
      .bind(id)
      .first();

    return jsonResponse({
      ok: true,
      autoGeneratedPOs: autoPOs,
      product: {
        ...updatedRow,
        stock: Number(updatedRow.stock),
        price: Number(updatedRow.price),
        min_stock: Number(updatedRow.min_stock ?? 6),
        reorder_qty: Number(updatedRow.reorder_qty ?? 12),
        supplier_id: updatedRow.supplier_id ? Number(updatedRow.supplier_id) : null,
        supplier_name: updatedRow.supplier_name || 'Sin proveedor asignado',
        supplier_phone: updatedRow.supplier_phone || '',
        active: Boolean(updatedRow.active),
      },
    });
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    const name = String(body.name || '').trim();
    const presentation = String(body.presentation || 'Unidad').trim();
    const category = String(body.category || 'otros').trim();
    const imageUrl =
      String(body.imageUrl || '').trim() ||
      'https://olimpica.vteximg.com.br/arquivos/ids/2492092/5000281003160_cd5cdf6c25ec4403ad9ca386feedb1cd.webp';
    const price = Math.max(0, Number(body.price) || 0);
    const stock = Math.max(0, Number(body.stock ?? 20));
    const minStock = Math.max(0, Number(body.min_stock ?? 6));
    const reorderQty = Math.max(1, Number(body.reorder_qty ?? 12));
    const supplierId = body.supplier_id ? Number(body.supplier_id) : null;
    const active = body.active === false ? 0 : 1;
    const sortOrder = Number(body.sort_order ?? 50);

    if (!name || price <= 0) {
      return jsonResponse({ ok: false, error: 'Nombre y precio mayor a $0 son obligatorios.' }, 400);
    }

    const slug =
      String(body.id || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `${name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}-${Date.now().toString().slice(-4)}`;

    await env.DB.prepare(
      `INSERT INTO products (id, name, presentation, category, imageUrl, price, stock, min_stock, reorder_qty, supplier_id, active, sort_order, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         presentation = excluded.presentation,
         category = excluded.category,
         imageUrl = excluded.imageUrl,
         price = excluded.price,
         stock = excluded.stock,
         min_stock = excluded.min_stock,
         reorder_qty = excluded.reorder_qty,
         supplier_id = excluded.supplier_id,
         active = excluded.active,
         sort_order = excluded.sort_order,
         updated_at = CURRENT_TIMESTAMP`
    )
      .bind(slug, name, presentation, category, imageUrl, price, stock, minStock, reorderQty, supplierId, active, sortOrder)
      .run();

    await checkAndTriggerAutoReorder(env, [slug]);

    return jsonResponse({
      ok: true,
      product: {
        id: slug,
        name,
        presentation,
        category,
        imageUrl,
        price,
        stock,
        min_stock: minStock,
        reorder_qty: reorderQty,
        supplier_id: supplierId,
        active: Boolean(active),
        sort_order: sortOrder,
      },
    });
  }

  return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
}

// --- Admin Suppliers & Programmed Reorders (/api/admin/suppliers & /api/admin/purchase-orders) ---
async function handleAdminSuppliers(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  if (!isAdminUser(user)) {
    return jsonResponse({ ok: false, error: 'Acceso denegado: Solo el administrador puede gestionar proveedores.' }, 403);
  }
  if (!env || !env.DB) return jsonResponse({ ok: false, error: 'Base de datos D1 no vinculada.' }, 500);

  const url = new URL(request.url);

  if (request.method === 'GET') {
    const supRes = await env.DB.prepare('SELECT * FROM suppliers ORDER BY id ASC').all();
    const poRes = await env.DB.prepare('SELECT * FROM purchase_orders ORDER BY id DESC LIMIT 40').all();
    const lowRes = await env.DB.prepare(
      `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone, s.contact_name AS supplier_contact
       FROM products p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.stock <= p.min_stock
       ORDER BY p.stock ASC`
    ).all();

    return jsonResponse({
      ok: true,
      suppliers: supRes.results || [],
      purchaseOrders: (poRes.results || []).map((po) => ({
        ...po,
        items: JSON.parse(po.items_json || '[]'),
      })),
      lowStockProducts: lowRes.results || [],
    });
  }

  if (request.method === 'DELETE') {
    const id = Number(url.searchParams.get('id'));
    if (!id) return jsonResponse({ ok: false, error: 'Falta ID del proveedor.' }, 400);
    await env.DB.prepare('UPDATE products SET supplier_id = NULL WHERE supplier_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM suppliers WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true, deletedId: id });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido.' }, 400);
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    const id = body.id ? Number(body.id) : null;
    const name = String(body.name || '').trim();
    const contactName = String(body.contact_name || '').trim();
    const phone = normalizeColombianPhone(body.phone || '3015153867');
    const email = String(body.email || '').trim();
    const deliveryDays = String(body.delivery_days || 'Lunes a Sábado').trim();

    if (!name || !body.phone) {
      return jsonResponse({ ok: false, error: 'Nombre de la distribuidora y WhatsApp son obligatorios.' }, 400);
    }

    if (id) {
      await env.DB.prepare(
        'UPDATE suppliers SET name = ?, contact_name = ?, phone = ?, email = ?, delivery_days = ? WHERE id = ?'
      )
        .bind(name, contactName, phone, email, deliveryDays, id)
        .run();
      return jsonResponse({ ok: true, supplier: { id, name, contact_name: contactName, phone, email, delivery_days: deliveryDays } });
    } else {
      const res = await env.DB.prepare(
        'INSERT INTO suppliers (name, contact_name, phone, email, delivery_days) VALUES (?, ?, ?, ?, ?)'
      )
        .bind(name, contactName, phone, email, deliveryDays)
        .run();
      return jsonResponse({
        ok: true,
        supplier: {
          id: res.meta?.last_row_id,
          name,
          contact_name: contactName,
          phone,
          email,
          delivery_days: deliveryDays,
        },
      });
    }
  }

  return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
}

async function handleAdminPurchaseOrders(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  if (!isAdminUser(user)) {
    return jsonResponse({ ok: false, error: 'Acceso denegado: Solo el administrador puede recibir y gestionar órdenes de compra.' }, 403);
  }
  if (!env || !env.DB) return jsonResponse({ ok: false, error: 'Base de datos D1 no vinculada.' }, 500);

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido.' }, 400);
  }

  const action = String(body.action || 'create');

  if (action === 'receive') {
    const poId = Number(body.id);
    if (!poId) return jsonResponse({ ok: false, error: 'Falta ID de la orden de compra.' }, 400);

    const po = await env.DB.prepare('SELECT * FROM purchase_orders WHERE id = ?').bind(poId).first();
    if (!po) return jsonResponse({ ok: false, error: 'Orden de compra no encontrada.' }, 404);
    if (po.status === 'recibida') {
      return jsonResponse({ ok: false, error: 'Esta orden de compra ya fue ingresada al inventario.' }, 400);
    }

    const items = JSON.parse(po.items_json || '[]');
    for (const item of items) {
      if (item.id && Number(item.qty) > 0) {
        await env.DB.prepare(
          'UPDATE products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        )
          .bind(Number(item.qty), item.id)
          .run();
      }
    }

    await env.DB.prepare(
      "UPDATE purchase_orders SET status = 'recibida', received_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
      .bind(poId)
      .run();

    return jsonResponse({ ok: true, receivedId: poId, itemsAdded: items.length });
  }

  // Crear Orden de Compra (Manual o por Lote de Stock Mínimo)
  const supplierId = body.supplier_id ? Number(body.supplier_id) : null;
  let supplierName = String(body.supplier_name || 'Proveedor General').trim();
  let supplierPhone = normalizeColombianPhone(body.supplier_phone || '3015153867');

  if (supplierId) {
    const sup = await env.DB.prepare('SELECT * FROM suppliers WHERE id = ?').bind(supplierId).first();
    if (sup) {
      supplierName = sup.name;
      supplierPhone = sup.phone;
    }
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return jsonResponse({ ok: false, error: 'Seleccione al menos un producto para pedir al proveedor.' }, 400);
  }

  const totalUnits = items.reduce((acc, i) => acc + (Number(i.qty) || 0), 0);
  const poNumber = `OC-${Date.now().toString().slice(-6)}`;

  await env.DB.prepare(
    `INSERT INTO purchase_orders (po_number, supplier_id, supplier_name, supplier_phone, items_json, total_units, status)
     VALUES (?, ?, ?, ?, ?, ?, 'enviada')`
  )
    .bind(poNumber, supplierId, supplierName, supplierPhone, JSON.stringify(items), totalUnits)
    .run();

  const lines = items.map((i) => `• *${i.qty} uds* de ${i.name} (${i.presentation || ''})`).join('\n');
  const waText = `Hola *${supplierName}*, te comparto la Orden de Reabastecimiento *#${poNumber}* de *Mucadele Licores* (Calle 11 # 24-36, Santa Marta):\n\n${lines}\n\nTotal unidades: *${totalUnits}*. Quedamos atentos a confirmación de despacho.`;
  const cleanPhone = supplierPhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;

  return jsonResponse({
    ok: true,
    poNumber,
    supplierName,
    supplierPhone,
    totalUnits,
    whatsappUrl,
  });
}

// --- Admin Carriers / Domiciliarios (/api/admin/carriers) ---
async function handleAdminCarriers(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  const shipdayHeaders = getShipdayHeaders(env);
  const url = new URL(request.url);

  if (request.method === 'GET') {
    let shipdayCarriers = [];
    try {
      const resp = await fetch(`${SHIPDAY_API_URL}/carriers`, { headers: shipdayHeaders });
      if (resp.ok) {
        shipdayCarriers = await resp.json();
      }
    } catch {}

    let dbCarriers = [];
    if (env && env.DB) {
      try {
        const res = await env.DB.prepare('SELECT * FROM carriers ORDER BY is_default DESC, name ASC').all();
        dbCarriers = res.results || [];
      } catch {}
    }

    const defaultCarrierRow = dbCarriers.find((c) => Number(c.is_default) === 1);
    const defaultCarrierId = defaultCarrierRow ? Number(defaultCarrierRow.id) : FALLBACK_CARRIER_ID;

    const mergedMap = new Map();
    for (const c of shipdayCarriers) {
      mergedMap.set(Number(c.id), {
        id: Number(c.id),
        name: c.name,
        phone: c.phoneNumber || '',
        email: c.email || '',
        isActive: Boolean(c.isActive),
        isOnShift: Boolean(c.isOnShift),
        isDefault: Number(c.id) === defaultCarrierId,
        source: 'shipday',
      });
    }
    for (const dbC of dbCarriers) {
      const numId = Number(dbC.id);
      if (!mergedMap.has(numId)) {
        mergedMap.set(numId, {
          id: numId,
          name: dbC.name,
          phone: dbC.phone,
          email: dbC.email || '',
          isActive: Boolean(dbC.active),
          isOnShift: false,
          isDefault: numId === defaultCarrierId,
          source: 'local',
        });
      } else {
        const existing = mergedMap.get(numId);
        existing.isDefault = numId === defaultCarrierId;
        if (!existing.email && dbC.email) existing.email = dbC.email;
      }
    }

    return jsonResponse({
      ok: true,
      defaultCarrierId,
      carriers: Array.from(mergedMap.values()),
    });
  }

  if (request.method === 'DELETE') {
    const carrierId = (url.searchParams.get('id') || '').trim();
    if (!carrierId) return jsonResponse({ ok: false, error: 'Falta ID del domiciliario.' }, 400);

    try {
      await fetch(`${SHIPDAY_API_URL}/carriers/${encodeURIComponent(carrierId)}`, {
        method: 'DELETE',
        headers: shipdayHeaders,
      });
    } catch {}

    if (env && env.DB) {
      await env.DB.prepare('DELETE FROM carriers WHERE id = ?').bind(Number(carrierId)).run();
    }
    return jsonResponse({ ok: true, deletedId: Number(carrierId) });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido.' }, 400);
  }

  if (request.method === 'PUT' || body.action === 'set_default') {
    const carrierId = Number(body.carrierId);
    const carrierName = String(body.name || 'Domiciliario').trim();
    const carrierPhone = normalizeColombianPhone(body.phone || '3015153867');
    if (!carrierId) return jsonResponse({ ok: false, error: 'Falta carrierId.' }, 400);

    if (env && env.DB) {
      await env.DB.prepare('UPDATE carriers SET is_default = 0').run();
      await env.DB.prepare(
        `INSERT INTO carriers (id, name, phone, is_default, active)
         VALUES (?, ?, ?, 1, 1)
         ON CONFLICT(id) DO UPDATE SET is_default = 1, active = 1`
      )
        .bind(carrierId, carrierName, carrierPhone)
        .run();
    }
    return jsonResponse({ ok: true, defaultCarrierId: carrierId });
  }

  if (request.method === 'POST') {
    const name = String(body.name || '').trim();
    const rawPhone = String(body.phone || '').trim();
    const phone = normalizeColombianPhone(rawPhone);
    const email =
      String(body.email || '').trim() ||
      `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'motorizado'}${Date.now().toString().slice(-3)}@mucadele.com.co`;
    const isDefault = body.isDefault ? 1 : 0;

    if (!name || !rawPhone) {
      return jsonResponse({ ok: false, error: 'Nombre y celular del domiciliario son obligatorios.' }, 400);
    }

    let createdId = null;
    let shipdayError = null;

    try {
      const createResp = await fetch(`${SHIPDAY_API_URL}/carriers`, {
        method: 'POST',
        headers: shipdayHeaders,
        body: JSON.stringify({
          name,
          phoneNumber: phone,
          email,
        }),
      });
      const createData = await createResp.json().catch(() => ({}));
      if (createResp.ok && createData.id) {
        createdId = Number(createData.id);
      } else {
        shipdayError = createData.message || createData.error || `HTTP ${createResp.status}`;
      }
    } catch (e) {
      shipdayError = e.message;
    }

    if (!createdId) {
      try {
        const listResp = await fetch(`${SHIPDAY_API_URL}/carriers`, { headers: shipdayHeaders });
        if (listResp.ok) {
          const all = await listResp.json();
          const digits = phone.replace(/\D/g, '').slice(-10);
          const found = all.find(
            (c) =>
              String(c.phoneNumber || '').replace(/\D/g, '').endsWith(digits) ||
              String(c.email || '').toLowerCase() === email.toLowerCase()
          );
          if (found) createdId = Number(found.id);
        }
      } catch {}
    }

    if (!createdId) {
      createdId = Number(Date.now().toString().slice(-6));
    }

    if (env && env.DB) {
      if (isDefault) {
        await env.DB.prepare('UPDATE carriers SET is_default = 0').run();
      }
      await env.DB.prepare(
        `INSERT INTO carriers (id, name, phone, email, is_default, active)
         VALUES (?, ?, ?, ?, ?, 1)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           phone = excluded.phone,
           email = excluded.email,
           is_default = CASE WHEN excluded.is_default = 1 THEN 1 ELSE carriers.is_default END,
           active = 1`
      )
        .bind(createdId, name, phone, email, isDefault)
        .run();
    }

    return jsonResponse({
      ok: true,
      carrier: {
        id: createdId,
        name,
        phone,
        email,
        isDefault: Boolean(isDefault),
      },
      shipdaySynced: !shipdayError,
      shipdayNote: shipdayError || 'Registrado en Shipday correctamente.',
    });
  }

  return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
}

// --- Admin Customers & Credit Portfolio (/api/admin/customers) ---
async function handleAdminCustomers(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  if (!env || !env.DB) {
    return jsonResponse({ ok: false, error: 'Base de datos D1 no disponible.' }, 500);
  }

  try {
    const ordersRes = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    const orders = ordersRes.results || [];

    const customersMap = new Map();

    // 1. Integrar directorio de clientes fiscales registrados en D1
    const dbCustomersRes = await env.DB.prepare('SELECT * FROM customers').all();
    for (const cust of dbCustomersRes.results || []) {
      const cleanPhone = (cust.phone || '').replace(/\D/g, '');
      const doc = String(cust.doc_number || '').trim();
      const key = doc
        ? `doc:${doc.toLowerCase()}`
        : cleanPhone.length >= 7
        ? `phone:${cleanPhone.slice(-10)}`
        : `name:${(cust.name || '').toLowerCase()}`;

      if (!customersMap.has(key)) {
        customersMap.set(key, {
          id: key,
          name: cust.name,
          phone: cust.phone || '',
          cleanPhone: cleanPhone.slice(-10),
          doc: doc,
          address: cust.address || '',
          total_orders: 0,
          total_spent: 0,
          total_debt: Number(cust.current_debt || 0),
          pending_credits_count: Number(cust.current_debt || 0) > 0 ? 1 : 0,
          first_order_date: cust.created_at,
          last_order_date: cust.created_at,
          orders: [],
        });
      }
    }

    // 2. Enriquecer con órdenes e histórico de compras
    for (const ord of orders) {
      const rawName = (ord.customer_name || 'Cliente Mostrador').trim();
      const rawPhone = (ord.customer_phone || '').trim();
      const rawDoc = (ord.customer_doc || '').trim();
      const cleanPhone = rawPhone.replace(/\D/g, '');

      // Llave única priorizando teléfono (si tiene al menos 7 dígitos), o cédula, o nombre normalizado
      let clientKey = '';
      if (cleanPhone.length >= 7) {
        clientKey = `phone:${cleanPhone.slice(-10)}`;
      } else if (rawDoc.length >= 4) {
        clientKey = `doc:${rawDoc.toLowerCase()}`;
      } else {
        clientKey = `name:${rawName.toLowerCase()}`;
      }

      if (!customersMap.has(clientKey)) {
        customersMap.set(clientKey, {
          id: clientKey,
          name: rawName,
          phone: rawPhone,
          cleanPhone: cleanPhone.slice(-10),
          doc: rawDoc,
          address: (ord.delivery_address || '').trim(),
          total_orders: 0,
          total_spent: 0,
          total_debt: 0,
          pending_credits_count: 0,
          first_order_date: ord.created_at,
          last_order_date: ord.created_at,
          orders: [],
        });
      }

      const client = customersMap.get(clientKey);
      client.total_orders += 1;
      const amount = Number(ord.total) || 0;
      client.total_spent += amount;

      // Actualizar datos si este pedido tiene más info
      if (!client.doc && rawDoc) client.doc = rawDoc;
      if (!client.phone && rawPhone) {
        client.phone = rawPhone;
        client.cleanPhone = cleanPhone.slice(-10);
      }
      if (!client.address && ord.delivery_address) client.address = ord.delivery_address.trim();

      const isPendingCredit = ord.payment_method === 'credito' && ord.payment_status === 'pending';
      if (isPendingCredit) {
        client.total_debt += amount;
        client.pending_credits_count += 1;
      }

      let items = [];
      try { items = JSON.parse(ord.items_json || '[]'); } catch {}

      client.orders.push({
        order_number: ord.order_number,
        created_at: ord.created_at,
        total: amount,
        payment_method: ord.payment_method || 'efectivo',
        payment_status: ord.payment_status || 'paid',
        items_count: items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0),
        items_summary: items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      });
    }

    const customersList = Array.from(customersMap.values()).map((c) => {
      let tier = 'Nuevo';
      let tierBadge = 'badge-new';
      if (c.total_orders >= 3) {
        tier = 'VIP / Frecuente';
        tierBadge = 'badge-vip';
      } else if (c.total_orders === 2) {
        tier = 'Recurrente';
        tierBadge = 'badge-recurring';
      }

      return {
        ...c,
        tier,
        tierBadge,
        has_pending_credit: c.total_debt > 0,
      };
    });

    // Ordenar: primero los que tienen deuda pendiente descendente, luego los más frecuentes / mayor gasto
    customersList.sort((a, b) => {
      if (b.total_debt !== a.total_debt) return b.total_debt - a.total_debt;
      if (b.total_orders !== a.total_orders) return b.total_orders - a.total_orders;
      return b.total_spent - a.total_spent;
    });

    // KPIs globales
    const kpis = {
      total_customers: customersList.length,
      frequent_customers: customersList.filter((c) => c.total_orders >= 2).length,
      debtors_count: customersList.filter((c) => c.total_debt > 0).length,
      total_debt: customersList.reduce((sum, c) => sum + c.total_debt, 0),
      total_revenue: customersList.reduce((sum, c) => sum + c.total_spent, 0),
    };

    return jsonResponse({
      ok: true,
      kpis,
      customers: customersList,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Error consultando clientes: ' + err.message }, 500);
  }
}

// --- POS Shift & Cash Control (/api/pos/shift/*) ---
async function handlePosShift(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  if (!env || !env.DB) {
    return jsonResponse({ ok: false, error: 'Base de datos D1 no disponible.' }, 500);
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // GET /api/pos/shift/current
  if (request.method === 'GET' && path === '/api/pos/shift/current') {
    try {
      const openShift = await env.DB.prepare(
        "SELECT * FROM cash_shifts WHERE status = 'open' ORDER BY opened_at DESC LIMIT 1"
      ).first();

      if (!openShift) {
        return jsonResponse({ ok: true, active: false, shift: null });
      }

      // Calculate shift totals from orders and movements
      const ordersRes = await env.DB.prepare(
        "SELECT payment_method, payment_status, total, payment_details FROM orders WHERE created_at >= ?"
      ).bind(openShift.opened_at).all();
      const orders = ordersRes.results || [];

      let cashSales = 0;
      let cardSales = 0;
      let transferSales = 0;
      let creditSales = 0;
      let combinedSales = 0;

      for (const ord of orders) {
        const amt = Number(ord.total) || 0;
        const method = ord.payment_method;
        if (method === 'efectivo') {
          cashSales += amt;
        } else if (method === 'tarjeta_credito' || method === 'tarjeta_debito') {
          cardSales += amt;
        } else if (method === 'transferencia') {
          transferSales += amt;
        } else if (method === 'credito') {
          creditSales += amt;
        } else if (method === 'combinado') {
          combinedSales += amt;
          try {
            const details = typeof ord.payment_details === 'string' ? JSON.parse(ord.payment_details) : ord.payment_details;
            if (details && details.cash) cashSales += Number(details.cash) || 0;
          } catch {}
        }
      }

      const movementsRes = await env.DB.prepare(
        "SELECT * FROM cash_movements WHERE shift_id = ? ORDER BY created_at DESC"
      ).bind(openShift.id).all();
      const movements = movementsRes.results || [];

      let totalExpenses = 0;
      let totalManualIncome = 0;
      for (const m of movements) {
        const mAmt = Number(m.amount) || 0;
        if (m.movement_type === 'retiro_gasto') totalExpenses += mAmt;
        else if (m.movement_type === 'ingreso_manual') totalManualIncome += mAmt;
      }

      const initialCash = Number(openShift.initial_cash) || 0;
      const expectedCash = initialCash + cashSales + totalManualIncome - totalExpenses;

      return jsonResponse({
        ok: true,
        active: true,
        shift: {
          ...openShift,
          initial_cash: initialCash,
          total_sales_cash: cashSales,
          total_sales_card: cardSales,
          total_sales_transfer: transferSales,
          total_sales_credit: creditSales,
          total_sales_combined: combinedSales,
          total_expenses: totalExpenses,
          total_manual_income: totalManualIncome,
          expected_cash: expectedCash,
          orders_count: orders.length,
          movements,
        },
      });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error consultando turno activo: ' + err.message }, 500);
    }
  }

  // POST /api/pos/shift/open
  if (request.method === 'POST' && path === '/api/pos/shift/open') {
    try {
      const existing = await env.DB.prepare(
        "SELECT id FROM cash_shifts WHERE status = 'open' LIMIT 1"
      ).first();
      if (existing) {
        return jsonResponse({ ok: false, error: 'Ya existe un turno de caja abierto (Turno #' + existing.id + '). Debe cerrarlo antes de iniciar otro.' }, 400);
      }

      const body = await request.json().catch(() => ({}));
      const initialCash = Math.max(0, Number(body.initial_cash) || 0);
      const notes = (body.notes || '').trim();
      const cashierName = user.role === 'admin' ? 'Superadmin' : 'Cajero de Turno';

      const res = await env.DB.prepare(
        `INSERT INTO cash_shifts (cashier_username, cashier_name, initial_cash, notes, status, opened_at)
         VALUES (?, ?, ?, ?, 'open', CURRENT_TIMESTAMP)`
      ).bind(user.username, cashierName, initialCash, notes).run();

      const shiftId = res.meta.last_row_id;
      return jsonResponse({
        ok: true,
        shift_id: shiftId,
        message: 'Turno de caja iniciado exitosamente.',
      });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error abriendo turno: ' + err.message }, 500);
    }
  }

  // POST /api/pos/shift/movement
  if (request.method === 'POST' && path === '/api/pos/shift/movement') {
    try {
      const body = await request.json().catch(() => ({}));
      const shiftId = Number(body.shift_id);
      const movementType = body.movement_type; // 'retiro_gasto' | 'ingreso_manual'
      const amount = Number(body.amount);
      const concept = (body.concept || '').trim();

      if (!shiftId || !['retiro_gasto', 'ingreso_manual'].includes(movementType) || amount <= 0 || !concept) {
        return jsonResponse({ ok: false, error: 'Datos de movimiento inválidos (monto > 0 y concepto obligatorio).' }, 400);
      }

      const shift = await env.DB.prepare("SELECT * FROM cash_shifts WHERE id = ? AND status = 'open'").bind(shiftId).first();
      if (!shift) {
        return jsonResponse({ ok: false, error: 'El turno especificado no está abierto.' }, 400);
      }

      await env.DB.prepare(
        `INSERT INTO cash_movements (shift_id, movement_type, amount, concept, created_by)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(shiftId, movementType, amount, concept, user.username).run();

      return jsonResponse({ ok: true, message: 'Movimiento registrado correctamente.' });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error registrando movimiento: ' + err.message }, 500);
    }
  }

  // POST /api/pos/shift/close (Arqueo ciego)
  if (request.method === 'POST' && path === '/api/pos/shift/close') {
    try {
      const body = await request.json().catch(() => ({}));
      const shiftId = Number(body.shift_id);
      const actualCash = Number(body.actual_cash);
      const notes = (body.notes || '').trim();

      if (!shiftId || isNaN(actualCash) || actualCash < 0) {
        return jsonResponse({ ok: false, error: 'Monto de conteo físico de efectivo inválido.' }, 400);
      }

      const shift = await env.DB.prepare("SELECT * FROM cash_shifts WHERE id = ? AND status = 'open'").bind(shiftId).first();
      if (!shift) {
        return jsonResponse({ ok: false, error: 'El turno no existe o ya fue cerrado.' }, 400);
      }

      // Re-calcular ventas del turno
      const ordersRes = await env.DB.prepare(
        "SELECT payment_method, total, payment_details FROM orders WHERE created_at >= ?"
      ).bind(shift.opened_at).all();
      const orders = ordersRes.results || [];

      let cashSales = 0;
      let cardSales = 0;
      let transferSales = 0;
      let creditSales = 0;
      let combinedSales = 0;

      for (const ord of orders) {
        const amt = Number(ord.total) || 0;
        const method = ord.payment_method;
        if (method === 'efectivo') cashSales += amt;
        else if (method === 'tarjeta_credito' || method === 'tarjeta_debito') cardSales += amt;
        else if (method === 'transferencia') transferSales += amt;
        else if (method === 'credito') creditSales += amt;
        else if (method === 'combinado') {
          combinedSales += amt;
          try {
            const details = typeof ord.payment_details === 'string' ? JSON.parse(ord.payment_details) : ord.payment_details;
            if (details && details.cash) cashSales += Number(details.cash) || 0;
          } catch {}
        }
      }

      const movementsRes = await env.DB.prepare(
        "SELECT * FROM cash_movements WHERE shift_id = ?"
      ).bind(shiftId).all();
      const movements = movementsRes.results || [];

      let totalExpenses = 0;
      let totalManualIncome = 0;
      for (const m of movements) {
        const mAmt = Number(m.amount) || 0;
        if (m.movement_type === 'retiro_gasto') totalExpenses += mAmt;
        else if (m.movement_type === 'ingreso_manual') totalManualIncome += mAmt;
      }

      const initialCash = Number(shift.initial_cash) || 0;
      const expectedCash = initialCash + cashSales + totalManualIncome - totalExpenses;
      const difference = actualCash - expectedCash;

      await env.DB.prepare(
        `UPDATE cash_shifts
         SET closed_at = CURRENT_TIMESTAMP,
             status = 'closed',
             expected_cash = ?,
             actual_cash = ?,
             difference = ?,
             total_sales_cash = ?,
             total_sales_card = ?,
             total_sales_transfer = ?,
             total_sales_credit = ?,
             total_sales_combined = ?,
             total_expenses = ?,
             notes = ?
         WHERE id = ?`
      ).bind(
        expectedCash,
        actualCash,
        difference,
        cashSales,
        cardSales,
        transferSales,
        creditSales,
        combinedSales,
        totalExpenses,
        notes,
        shiftId
      ).run();

      return jsonResponse({
        ok: true,
        message: 'Turno cerrado y arqueo registrado con éxito.',
        summary: {
          shift_id: shiftId,
          opened_at: shift.opened_at,
          initial_cash: initialCash,
          total_sales_cash: cashSales,
          total_sales_card: cardSales,
          total_sales_transfer: transferSales,
          total_sales_credit: creditSales,
          total_expenses: totalExpenses,
          expected_cash: expectedCash,
          actual_cash: actualCash,
          difference,
          difference_label: difference === 0 ? 'CUADRE EXACTO' : difference > 0 ? 'SOBRANTE' : 'FALTANTE',
        },
      });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error cerrando turno: ' + err.message }, 500);
    }
  }

  // GET /api/pos/shift/history
  if (request.method === 'GET' && path === '/api/pos/shift/history') {
    try {
      const history = await env.DB.prepare(
        "SELECT * FROM cash_shifts ORDER BY opened_at DESC LIMIT 20"
      ).all();
      return jsonResponse({ ok: true, shifts: history.results || [] });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error consultando historial de turnos: ' + err.message }, 500);
    }
  }

  return jsonResponse({ ok: false, error: 'Ruta no encontrada en gestión de turnos.' }, 404);
}

// --- Directorio de Clientes Fiscales y Cartera (/api/customers) ---
async function handleCustomers(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  if (!env || !env.DB) {
    return jsonResponse({ ok: false, error: 'Base de datos D1 no disponible.' }, 500);
  }

  const url = new URL(request.url);

  if (request.method === 'GET') {
    try {
      const q = (url.searchParams.get('q') || '').trim();

      // Sincronización transparente inicial si customers está vacía
      const countRes = await env.DB.prepare("SELECT COUNT(*) as count FROM customers").first();
      if (!countRes || countRes.count === 0) {
        const rawOrders = await env.DB.prepare(
          "SELECT customer_name, customer_phone, customer_doc FROM orders WHERE customer_phone IS NOT NULL AND customer_phone != ''"
        ).all();
        const seenPhones = new Set();
        for (const o of (rawOrders.results || [])) {
          const ph = (o.customer_phone || '').trim();
          if (!ph || seenPhones.has(ph)) continue;
          seenPhones.add(ph);
          const name = (o.customer_name || 'Cliente').trim();
          const doc = (o.customer_doc || '').replace(/[^\w]/g, '') || ph;
          try {
            await env.DB.prepare(
              `INSERT OR IGNORE INTO customers (doc_type, doc_number, name, phone)
               VALUES ('CC', ?, ?, ?)`
            ).bind(doc, name, ph).run();
          } catch {}
        }
      }

      let customers;
      if (q) {
        const searchPattern = `%${q}%`;
        const res = await env.DB.prepare(
          `SELECT * FROM customers 
           WHERE doc_number LIKE ? OR phone LIKE ? OR name LIKE ? OR commercial_name LIKE ?
           ORDER BY name ASC LIMIT 25`
        ).bind(searchPattern, searchPattern, searchPattern, searchPattern).all();
        customers = res.results || [];
      } else {
        const res = await env.DB.prepare(
          "SELECT * FROM customers ORDER BY created_at DESC LIMIT 50"
        ).all();
        customers = res.results || [];
      }

      return jsonResponse({ ok: true, customers });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error consultando clientes: ' + err.message }, 500);
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json().catch(() => ({}));
      const docType = (body.doc_type || 'CC').trim().toUpperCase();
      const docNumber = (body.doc_number || '').trim();
      const dv = (body.dv || '').trim();
      const name = (body.name || '').trim();
      const commercialName = (body.commercial_name || '').trim();
      const email = (body.email || '').trim();
      const phone = (body.phone || '').trim();
      const address = (body.address || '').trim();
      const cityCode = (body.city_code || '47001').trim();
      const taxRegime = (body.tax_regime || '49').trim();
      const fiscalResponsibility = (body.fiscal_responsibility || 'R-99-PN').trim();
      const creditLimit = Math.max(0, Number(body.credit_limit) || 0);

      if (!docNumber || !name || !phone) {
        return jsonResponse({ ok: false, error: 'Número de documento, nombre completo y teléfono son obligatorios.' }, 400);
      }

      const existing = await env.DB.prepare("SELECT id FROM customers WHERE doc_number = ?").bind(docNumber).first();
      if (existing) {
        await env.DB.prepare(
          `UPDATE customers
           SET doc_type = ?, dv = ?, name = ?, commercial_name = ?, email = ?, phone = ?, address = ?, city_code = ?, tax_regime = ?, fiscal_responsibility = ?, credit_limit = ?
           WHERE id = ?`
        ).bind(docType, dv, name, commercialName, email, phone, address, cityCode, taxRegime, fiscalResponsibility, creditLimit, existing.id).run();
        return jsonResponse({ ok: true, customer_id: existing.id, message: 'Cliente actualizado exitosamente.' });
      } else {
        const ins = await env.DB.prepare(
          `INSERT INTO customers (doc_type, doc_number, dv, name, commercial_name, email, phone, address, city_code, tax_regime, fiscal_responsibility, credit_limit)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(docType, docNumber, dv, name, commercialName, email, phone, address, cityCode, taxRegime, fiscalResponsibility, creditLimit).run();
        return jsonResponse({ ok: true, customer_id: ins.meta.last_row_id, message: 'Cliente registrado exitosamente.' });
      }
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error guardando cliente: ' + err.message }, 500);
    }
  }

  return jsonResponse({ ok: false, error: 'Método no permitido.' }, 405);
}

// --- AI Invoice Processing (/api/admin/scan-invoice) ---
async function handleAdminScanInvoice(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  if (!isAdminUser(user)) {
    return jsonResponse({ ok: false, error: 'Acceso denegado: El usuario cajero solo tiene permisos para vender y no puede procesar facturas de inventario.' }, 403);
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Método no permitido' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido.' }, 400);
  }

  const { imageBase64 } = body || {};
  if (!imageBase64) {
    return jsonResponse({ ok: false, error: 'Se requiere la imagen o página de factura en base64.' }, 400);
  }

  // 1. Obtener catálogo actual de D1 para cotejar
  let catalogList = [];
  if (env && env.DB) {
    try {
      const { results } = await env.DB.prepare(
        'SELECT id, name, presentation, stock, category FROM products WHERE active = 1 ORDER BY sort_order ASC, name ASC'
      ).all();
      catalogList = results || [];
    } catch {}
  }
  if (catalogList.length === 0) {
    catalogList = DEFAULT_CATALOG;
  }

  const catalogSummary = catalogList.map((p) => ({ id: p.id, name: p.name, stock: p.stock }));

  const promptText = `Eres un asistente experto en auditoría y extracción de facturas comerciales de compra de licores para Mucadele Licores en Santa Marta, Colombia.
Analiza la imagen adjunta de la factura comercial.
Extrae la información en un formato JSON estrictamente válido, sin texto adicional ni bloques markdown, con la siguiente estructura:
{
  "supplier_name": "Nombre de la distribuidora o proveedor",
  "invoice_number": "Número de factura (ej. FE-12345)",
  "invoice_date": "Fecha de la factura (AAAA-MM-DD)",
  "total_amount": 0,
  "items": [
    {
      "raw_name": "Nombre original tal como aparece en la factura",
      "quantity": 0,
      "unit_cost": 0,
      "subtotal": 0,
      "matched_product_id": "id del producto del catálogo si coincide exactamente o null"
    }
  ]
}

Catálogo oficial de Mucadele Licores para mapear matched_product_id:
${JSON.stringify(catalogSummary)}`;

  let aiRawText = '';
  const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '').trim();

  // 2. Ejecución con env.AI (Cloudflare Workers AI)
  if (env && env.AI) {
    try {
      const aiResponse = await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
        prompt: promptText,
        image: cleanBase64,
        max_tokens: 1800,
      });
      aiRawText = aiResponse?.response || (typeof aiResponse === 'string' ? aiResponse : '');
    } catch (err) {
      console.warn('env.AI falló, intentando REST API de Workers AI:', err);
    }
  }

  // Fallback REST API Workers AI con token
  if (!aiRawText) {
    try {
      const cfToken = env.CLOUDFLARE_API_TOKEN || 'q4vD5o779b5YgHk0L_mR51X24Hk0V8mP';
      const accountId = env.CLOUDFLARE_ACCOUNT_ID || 'fc3f86dccb5f80460e28e5ba899d0427';
      const restResp = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cfToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptText,
            image: cleanBase64,
            max_tokens: 1800,
          }),
        }
      );
      if (restResp.ok) {
        const restData = await restResp.json();
        aiRawText = restData?.result?.response || '';
      }
    } catch (err) {
      console.error('Error invocando Workers AI REST API:', err);
    }
  }

  // 3. Parsear JSON de la IA
  let parsedInvoice = null;
  if (aiRawText) {
    try {
      const jsonMatch = aiRawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedInvoice = JSON.parse(jsonMatch[0]);
      }
    } catch {}
  }

  if (!parsedInvoice || !Array.isArray(parsedInvoice.items) || parsedInvoice.items.length === 0) {
    // Si la imagen era borrosa o la IA no extrajo ítems, armar estructura asistida
    parsedInvoice = {
      supplier_name: parsedInvoice?.supplier_name || 'Distribuidora de Licores',
      invoice_number: parsedInvoice?.invoice_number || `FAC-${Date.now().toString().slice(-6)}`,
      invoice_date: parsedInvoice?.invoice_date || new Date().toISOString().split('T')[0],
      total_amount: Number(parsedInvoice?.total_amount) || 0,
      items: [
        {
          raw_name: 'Ítem detectado en factura',
          quantity: 12,
          unit_cost: 0,
          subtotal: 0,
          matched_product_id: catalogList[0]?.id || null,
        },
      ],
    };
  }

  // 4. Enriquecer con cotejo inteligente y stock actual de D1
  const catalogMap = new Map(catalogList.map((p) => [p.id, p]));
  const enrichedItems = (parsedInvoice.items || []).map((item) => {
    let matchedId = item.matched_product_id;
    let matchedProd = catalogMap.get(matchedId);

    // Búsqueda por similitud semántica si no hubo match directo
    if (!matchedProd) {
      const rawLower = (item.raw_name || '').toLowerCase();
      matchedProd = catalogList.find((p) => {
        const pLower = p.name.toLowerCase();
        if (rawLower.includes('buchan') && pLower.includes('buchan')) return true;
        if ((rawLower.includes('old parr') || rawLower.includes('parr')) && pLower.includes('old parr')) return true;
        if (rawLower.includes('antioq') && pLower.includes('antioqueño')) {
          if (rawLower.includes('azul') || rawLower.includes('sin azucar')) return p.id.includes('azul');
          if (rawLower.includes('verde') || rawLower.includes('24')) return p.id.includes('verde');
          return true;
        }
        if (rawLower.includes('medellin') && pLower.includes('medellín')) return true;
        if (rawLower.includes('caldas') && pLower.includes('caldas')) return true;
        if (rawLower.includes('corona') && pLower.includes('corona')) return true;
        if (rawLower.includes('aguila') && pLower.includes('águila')) return true;
        if (rawLower.includes('club') && pLower.includes('club colombia')) return true;
        if (rawLower.includes('cuervo') && pLower.includes('cuervo')) return true;
        if (rawLower.includes('don julio') && pLower.includes('don julio')) return true;
        if (rawLower.includes('absolut') && pLower.includes('absolut')) return true;
        if (rawLower.includes('hielo') && pLower.includes('hielo')) return true;
        return false;
      });
      if (matchedProd) {
        matchedId = matchedProd.id;
      }
    }

    const currentStock = matchedProd ? Number(matchedProd.stock ?? 0) : 0;
    const qty = Math.max(1, Number(item.quantity) || 1);

    return {
      raw_name: item.raw_name || 'Ítem Facturado',
      quantity: qty,
      unit_cost: Number(item.unit_cost) || 0,
      subtotal: (Number(item.unit_cost) || 0) * qty,
      matched_product_id: matchedId || null,
      matched_product_name: matchedProd ? matchedProd.name : 'Seleccionar producto...',
      current_stock: currentStock,
      projected_stock: currentStock + qty,
    };
  });

  return jsonResponse({
    ok: true,
    invoice: {
      supplier_name: parsedInvoice.supplier_name || 'Distribuidora Comercial',
      invoice_number: parsedInvoice.invoice_number || `FAC-${Date.now().toString().slice(-6)}`,
      invoice_date: parsedInvoice.invoice_date || new Date().toISOString().split('T')[0],
      total_amount: Number(parsedInvoice.total_amount) || 0,
      items: enrichedItems,
    },
    catalog: catalogList.map((p) => ({
      id: p.id,
      name: p.name,
      presentation: p.presentation,
      stock: Number(p.stock ?? 0),
    })),
  });
}

// --- Apply Scanned Invoice into Real Inventory (/api/admin/apply-invoice) ---
async function handleAdminApplyInvoice(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  if (!isAdminUser(user)) {
    return jsonResponse({ ok: false, error: 'Acceso denegado: El usuario cajero solo tiene permisos para vender y no puede modificar el inventario.' }, 403);
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Método no permitido' }, 405);
  }

  if (!env || !env.DB) {
    return jsonResponse({ ok: false, error: 'Base de datos D1 no disponible.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido.' }, 400);
  }

  const { supplier_name = 'Proveedor Factura IA', invoice_number, invoice_date, items = [] } = body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return jsonResponse({ ok: false, error: 'Debe seleccionar al menos un producto para ingresar al inventario.' }, 400);
  }

  try {
    const validItems = items.filter((i) => Number(i.quantity) > 0 && (i.product_id || i.raw_name));
    if (validItems.length === 0) {
      return jsonResponse({ ok: false, error: 'Ningún ítem tiene un producto asignado o nombre válido con cantidad mayor a cero.' }, 400);
    }

    // 0. Auto-registrar o localizar el proveedor en la tabla suppliers si se informó nombre
    let resolvedSupplierId = null;
    const cleanSupplierName = String(supplier_name || '').trim();
    if (cleanSupplierName && !/^Sin proveedor/i.test(cleanSupplierName)) {
      const existingSup = await env.DB.prepare(
        'SELECT id FROM suppliers WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1'
      )
        .bind(cleanSupplierName)
        .first();
      if (existingSup?.id) {
        resolvedSupplierId = Number(existingSup.id);
      } else {
        const insSup = await env.DB.prepare(
          `INSERT INTO suppliers (name, contact_name, phone, delivery_days)
           VALUES (?, 'Creado por Causación IA', '+573000000000', 'Lunes a Sábado')`
        )
          .bind(cleanSupplierName)
          .run();
        if (insSup?.meta?.last_row_id) {
          resolvedSupplierId = Number(insSup.meta.last_row_id);
        }
      }
    }

    // 1. Actualizar stock de existentes o auto-crear productos nuevos atómicamente en Cloudflare D1
    const dbStatements = [];
    const affectedIds = [];

    for (const item of validItems) {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const isNew = !item.product_id || item.product_id === '__new__';

      if (!isNew) {
        affectedIds.push(item.product_id);
        dbStatements.push(
          env.DB.prepare(
            'UPDATE products SET stock = stock + ?, supplier_id = COALESCE(supplier_id, ?), updated_at = CURRENT_TIMESTAMP WHERE id = ?'
          ).bind(qty, resolvedSupplierId, item.product_id)
        );
      } else {
        const rawName = String(item.raw_name || 'Producto Nuevo Factura').trim();
        const baseSlug = rawName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        const newSlug = `${baseSlug || 'prod'}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 90 + 10)}`;
        const unitCost = Math.max(0, Number(item.unit_cost) || 0);
        const salePrice =
          Number(item.sale_price) > 0
            ? Number(item.sale_price)
            : Math.max(5000, Math.ceil(((unitCost || 35000) * 1.35) / 500) * 500);
        const category = String(item.category || 'otros').trim();
        const presentation = String(item.presentation || 'Unidad').trim();
        const defaultImg = 'https://olimpica.vteximg.com.br/arquivos/ids/2492092/5000281003160_cd5cdf6c25ec4403ad9ca386feedb1cd.webp';

        item.product_id = newSlug;
        affectedIds.push(newSlug);

        dbStatements.push(
          env.DB.prepare(
            `INSERT INTO products (id, name, presentation, category, imageUrl, price, stock, min_stock, reorder_qty, supplier_id, active, sort_order, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 6, 12, ?, 1, 50, CURRENT_TIMESTAMP)`
          ).bind(newSlug, rawName, presentation, category, defaultImg, salePrice, qty, resolvedSupplierId)
        );
      }
    }

    await env.DB.batch(dbStatements);

    // 2. Registrar en purchase_orders como orden de compra recibida (causación)
    const poNumber = invoice_number
      ? `FAC-${String(invoice_number).replace(/[^a-zA-Z0-9-]/g, '')}`
      : `ING-${Date.now().toString().slice(-6)}`;
    const totalUnits = validItems.reduce((sum, i) => sum + Number(i.quantity), 0);

    await env.DB.prepare(
      `INSERT INTO purchase_orders (po_number, supplier_id, supplier_name, supplier_phone, items_json, total_units, status, received_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'recibida', CURRENT_TIMESTAMP, ?)`
    )
      .bind(
        poNumber,
        resolvedSupplierId,
        cleanSupplierName || 'Proveedor Factura IA',
        'Factura de Compra IA',
        JSON.stringify(validItems),
        totalUnits,
        invoice_date ? `${invoice_date} 12:00:00` : new Date().toISOString()
      )
      .run();

    // 3. Consultar los stocks actualizados de estos productos
    const placeholders = affectedIds.map(() => '?').join(', ');
    const updatedProds = await env.DB.prepare(
      `SELECT id, name, stock FROM products WHERE id IN (${placeholders})`
    )
      .bind(...affectedIds)
      .all();

    return jsonResponse({
      ok: true,
      message: `¡Inventario actualizado! Se ingresaron ${totalUnits} unidades en ${validItems.length} productos.`,
      po_number: poNumber,
      supplier_id: resolvedSupplierId,
      total_units_added: totalUnits,
      updated_products_count: validItems.length,
      updated_products: updatedProds.results || [],
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Error aplicando factura a inventario en D1: ' + err.message }, 500);
  }
}

// --- Orders GET & POST (/api/order) ---
async function handleOrderGet(request, env) {
  const url = new URL(request.url);
  const orderNumber = url.searchParams.get('orderNumber');
  const list = url.searchParams.get('list');
  const headers = getShipdayHeaders(env);

  if (list === 'active') {
    // Listar todas las órdenes activas y el historial completo requiere sesión de superadmin
    const user = await verifySession(request, env);
    if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

    let shipdayOrders = [];
    try {
      const ordersResp = await fetch(`${SHIPDAY_API_URL}/orders`, { headers });
      if (ordersResp.ok) {
        const parsed = await ordersResp.json();
        if (Array.isArray(parsed)) shipdayOrders = parsed.slice(0, 30);
      }
    } catch {}

    let dbOrders = [];
    const summaryByMethod = {
      efectivo: 0,
      tarjeta_credito: 0,
      tarjeta_debito: 0,
      transferencia: 0,
      credito: 0,
      credito_pendiente: 0,
      combinado: 0,
      otros: 0,
      total_recaudado: 0,
      total_facturado: 0,
    };
    const creditsSummaryMap = new Map();

    if (env && env.DB) {
      try {
        const res = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100').all();
        dbOrders = (res.results || []).map((o) => {
          let items = [];
          try { items = JSON.parse(o.items_json || '[]'); } catch {}
          let details = {};
          try {
            details = typeof o.payment_details === 'string' ? JSON.parse(o.payment_details) : (o.payment_details || {});
          } catch {}
          return {
            ...o,
            items,
            payment_status: o.payment_status || 'paid',
            payment_details: details,
            customer_doc: o.customer_doc || '',
          };
        });

        for (const ord of dbOrders) {
          const tot = Number(ord.total) || 0;
          summaryByMethod.total_facturado += tot;
          const method = ord.payment_method || 'efectivo';
          const isPendingCredit = method === 'credito' && ord.payment_status === 'pending';

          if (isPendingCredit) {
            summaryByMethod.credito_pendiente += tot;
            summaryByMethod.credito += tot;

            const custKey = `${(ord.customer_name || 'Sin Nombre').trim().toLowerCase()}::${(ord.customer_doc || ord.customer_phone || '').trim()}`;
            if (!creditsSummaryMap.has(custKey)) {
              creditsSummaryMap.set(custKey, {
                customer_name: ord.customer_name || 'Cliente sin nombre',
                customer_phone: ord.customer_phone || '',
                customer_doc: ord.customer_doc || '',
                total_debt: 0,
                orders: [],
              });
            }
            const group = creditsSummaryMap.get(custKey);
            group.total_debt += tot;
            group.orders.push({
              order_number: ord.order_number,
              created_at: ord.created_at,
              total: tot,
              items: ord.items,
            });
          } else {
            summaryByMethod.total_recaudado += tot;
            if (method === 'combinado' && ord.payment_details && Array.isArray(ord.payment_details.split)) {
              summaryByMethod.combinado += tot;
              for (const part of ord.payment_details.split) {
                const partMethod = (part.method || 'efectivo').toLowerCase();
                const partAmt = Number(part.amount) || 0;
                if (summaryByMethod[partMethod] !== undefined) {
                  summaryByMethod[partMethod] += partAmt;
                } else {
                  summaryByMethod.otros += partAmt;
                }
              }
            } else if (summaryByMethod[method] !== undefined) {
              summaryByMethod[method] += tot;
            } else {
              summaryByMethod.otros += tot;
            }
          }
        }
      } catch {}
    }

    return jsonResponse({
      ok: true,
      orders: shipdayOrders,
      dbOrders,
      summaryByMethod,
      creditsSummary: Array.from(creditsSummaryMap.values()),
    });
  }

  if (!orderNumber) {
    // Proteger datos privados de domiciliarios: requiere sesión administrativa
    const user = await verifySession(request, env);
    if (!user) {
      return jsonResponse({ ok: false, error: 'No autorizado para consultar transportistas.' }, 401);
    }

    try {
      const carriersResp = await fetch(`${SHIPDAY_API_URL}/carriers`, { headers });
      const carriers = carriersResp.ok ? await carriersResp.json() : [];
      let defaultCarrierId = FALLBACK_CARRIER_ID;
      if (env && env.DB) {
        try {
          const defRow = await env.DB.prepare('SELECT id FROM carriers WHERE is_default = 1 LIMIT 1').first();
          if (defRow && defRow.id) defaultCarrierId = Number(defRow.id);
        } catch {}
      }
      return jsonResponse({
        ok: true,
        store: STORE_CONFIG,
        defaultCarrierId,
        carriersCount: Array.isArray(carriers) ? carriers.length : 0,
        carriers: Array.isArray(carriers)
          ? carriers.map((c) => ({
              id: c.id,
              name: c.name,
              phone: c.phoneNumber,
              isActive: c.isActive,
              isOnShift: c.isOnShift,
              isDefault: Number(c.id) === defaultCarrierId,
            }))
          : [],
      });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  }

  // Consulta individual de rastreo por orderNumber
  try {
    const detailResp = await fetch(
      `${SHIPDAY_API_URL}/orders/${encodeURIComponent(orderNumber)}`,
      { headers }
    );
    const details = detailResp.ok ? await detailResp.json() : [];
    let orderData = Array.isArray(details) && details.length > 0 ? details[0] : null;
    if (orderData) {
      const user = await verifySession(request, env);
      if (!user) {
        // Redactar datos privados del transportista para rastreo público
        const sanitized = { ...orderData };
        if (sanitized.carrier && (sanitized.carrier.phoneNumber || sanitized.carrier.phone)) {
          sanitized.carrier = {
            ...sanitized.carrier,
            phoneNumber: undefined,
            phone: undefined,
          };
        }
        orderData = sanitized;
      }
    }
    return jsonResponse({
      ok: true,
      order: orderData,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

async function handleOrderPatch(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido.' }, 400);
  }

  const { orderNumber, paymentStatus = 'paid', paidMethod = 'efectivo', notes = '' } = body || {};
  if (!orderNumber) {
    return jsonResponse({ ok: false, error: 'orderNumber es requerido.' }, 400);
  }

  if (env && env.DB) {
    try {
      const existing = await env.DB.prepare('SELECT * FROM orders WHERE order_number = ? LIMIT 1').bind(orderNumber).first();
      if (!existing) {
        return jsonResponse({ ok: false, error: 'Orden no encontrada en la base de datos.' }, 404);
      }
      let details = {};
      try { details = JSON.parse(existing.payment_details || '{}'); } catch {}
      details.settledAt = new Date().toISOString();
      details.settledMethod = paidMethod;
      if (notes) details.settledNotes = notes;

      await env.DB.prepare(
        'UPDATE orders SET payment_status = ?, payment_details = ? WHERE order_number = ?'
      ).bind(paymentStatus, JSON.stringify(details), orderNumber).run();

      return jsonResponse({
        ok: true,
        orderNumber,
        paymentStatus,
        settledMethod: paidMethod,
        settledAt: details.settledAt,
      });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error actualizando pago: ' + err.message }, 500);
    }
  }

  return jsonResponse({ ok: false, error: 'Base de datos D1 no disponible.' }, 500);
}

async function handleOrderPost(request, env) {
  const headers = getShipdayHeaders(env);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const {
    orderType = 'delivery',
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    customerDoc = '',
    neighborhood,
    deliveryInstruction,
    paymentMethod: rawPaymentMethod = 'efectivo',
    paymentStatus: rawPaymentStatus = null,
    paymentDetails = null,
    items = [],
    deliveryFee = 6000,
    tips = 0,
    autoAssignDriver = true,
    carrierId: requestedCarrierId = null,
    skipShipday = false,
    discountAmount = 0,
    discountDetails = null,
  } = body || {};

  // Normalización técnica y estricta de métodos de pago
  let paymentMethod = (rawPaymentMethod || 'efectivo').toString().trim().toLowerCase();
  if (paymentMethod === 'cash') paymentMethod = 'efectivo';
  else if (paymentMethod === 'card' || paymentMethod === 'tarjeta credito' || paymentMethod === 'tarjeta_credito') paymentMethod = 'tarjeta_credito';
  else if (paymentMethod === 'nequi' || paymentMethod === 'daviplata' || paymentMethod === 'banco' || paymentMethod === 'transferencia') paymentMethod = 'transferencia';
  else if (paymentMethod === 'tarjeta debito' || paymentMethod === 'tarjeta_debito' || paymentMethod === 'debito') paymentMethod = 'tarjeta_debito';
  else if (paymentMethod === 'a credito' || paymentMethod === 'credito' || paymentMethod === 'crédito') paymentMethod = 'credito';
  else if (paymentMethod === 'combinado' || paymentMethod === 'mixto') paymentMethod = 'combinado';
  else if (paymentMethod === 'otros' || paymentMethod === 'otro' || paymentMethod === 'otros metodos') paymentMethod = 'otros';

  const paymentStatus = rawPaymentStatus || (paymentMethod === 'credito' ? 'pending' : 'paid');

  const isNoDelivery = orderType === 'pickup' || orderType === 'pos_counter';
  const resolvedName = (customerName || (orderType === 'pos_counter' ? 'Cliente Mostrador' : '')).trim();
  const resolvedPhone = (customerPhone || (orderType === 'pos_counter' ? '3015153867' : '')).trim();
  const resolvedAddress = isNoDelivery
    ? STORE_CONFIG.address
    : (customerAddress || '').trim();

  if (!resolvedName || !resolvedPhone || !resolvedAddress || !Array.isArray(items) || items.length === 0) {
    return jsonResponse(
      { ok: false, error: 'Faltan datos obligatorios del cliente o el carrito está vacío.' },
      400
    );
  }

  // 1. Validar formato de cada ítem (id y cantidad estrictamente positiva)
  for (const item of items) {
    if (!item.id || typeof item.id !== 'string') {
      return jsonResponse({ ok: false, error: 'Identificador de producto faltante o inválido.' }, 400);
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return jsonResponse({ ok: false, error: `Cantidad inválida para el producto: ${item.name || item.id}` }, 400);
    }
  }

  // 2. Consultar obligatoriamente la tabla products en D1 para cada producto
  let dbProducts = [];
  if (env && env.DB) {
    try {
      const placeholders = items.map(() => '?').join(', ');
      const ids = items.map((i) => i.id);
      const query = `SELECT id, name, presentation, price, stock, active FROM products WHERE id IN (${placeholders})`;
      const dbRes = await env.DB.prepare(query).bind(...ids).all();
      dbProducts = dbRes.results || [];
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error consultando inventario en D1: ' + err.message }, 500);
    }
  } else {
    dbProducts = DEFAULT_CATALOG;
  }

  const dbMap = new Map(dbProducts.map((p) => [p.id, p]));

  // 3. Validar existencia, estado activo y stock de cada producto
  const orderItems = [];
  for (const item of items) {
    const dbProd = dbMap.get(item.id);
    if (!dbProd || dbProd.active === 0) {
      return jsonResponse({ ok: false, error: `Producto no disponible: ${item.name || item.id}` }, 400);
    }
    const requestedQty = Number(item.quantity) || 1;
    if (Number(dbProd.stock) < requestedQty) {
      return jsonResponse(
        {
          ok: false,
          error: `Stock insuficiente para ${dbProd.name}. Disponible: ${dbProd.stock}, solicitado: ${requestedQty}`,
        },
        400
      );
    }
    // Recalcular unitPrice usando exclusivamente el precio en D1 (ignorar item.price del cliente)
    const unitPrice = Number(dbProd.price) || 0;
    orderItems.push({
      id: dbProd.id,
      name: dbProd.name,
      unitPrice,
      quantity: requestedQty,
      detail: dbProd.presentation || item.presentation || '',
    });
  }

  // 4. Recalcular subtotales y total exclusivamente en el backend
  const itemsSubtotal = orderItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  const effectiveDeliveryFee = isNoDelivery ? 0 : Number(deliveryFee || 0);
  const appliedDiscount = Math.min(itemsSubtotal, Math.max(0, Number(discountAmount || 0)));
  const totalOrderCost = Math.max(0, itemsSubtotal - appliedDiscount + effectiveDeliveryFee + Number(tips || 0));

  const prefix = orderType === 'pos_counter' ? 'POS' : orderType === 'pickup' ? 'RET' : 'MUC';
  const orderNumber = `${prefix}-${Date.now().toString().slice(-6)}`;
  const { date: expectedDeliveryDate, time: expectedDeliveryTime } = formatBogotaDateAndTime(
    isNoDelivery ? 5 : 35
  );

  const fullAddress = isNoDelivery
    ? `MOSTRADOR LOCAL · ${STORE_CONFIG.address}`
    : neighborhood
    ? `${resolvedAddress}, Barrio ${neighborhood.trim()}, Santa Marta, Magdalena, Colombia`
    : `${resolvedAddress}, Santa Marta, Magdalena, Colombia`;

  let targetCarrierId = requestedCarrierId ? Number(requestedCarrierId) : FALLBACK_CARRIER_ID;
  let targetCarrierName = 'Motorizado Mucadele';

  if (env && env.DB) {
    try {
      if (!requestedCarrierId) {
        const defCarrier = await env.DB.prepare('SELECT id, name FROM carriers WHERE is_default = 1 LIMIT 1').first();
        if (defCarrier && defCarrier.id) {
          targetCarrierId = Number(defCarrier.id);
          targetCarrierName = defCarrier.name;
        }
      } else {
        const selCarrier = await env.DB.prepare('SELECT id, name FROM carriers WHERE id = ? LIMIT 1')
          .bind(targetCarrierId)
          .first();
        if (selCarrier && selCarrier.name) {
          targetCarrierName = selCarrier.name;
        }
      }
    } catch {}
  }

  let paymentLabel = 'Efectivo';
  if (paymentMethod === 'tarjeta_credito') paymentLabel = 'Tarjeta de Crédito (Datáfono)';
  else if (paymentMethod === 'tarjeta_debito') paymentLabel = 'Tarjeta Débito (Datáfono)';
  else if (paymentMethod === 'transferencia') paymentLabel = `Transferencia ${paymentDetails?.reference ? `[Ref: ${paymentDetails.reference}]` : ''}`.trim();
  else if (paymentMethod === 'combinado') paymentLabel = 'Pago Combinado';
  else if (paymentMethod === 'credito') paymentLabel = `A CRÉDITO [PENDIENTE] · Doc/Tel: ${customerDoc || resolvedPhone}`;
  else if (paymentMethod === 'otros') paymentLabel = `Otros: ${paymentDetails?.concept || 'Varios'}`;

  // Enriquecer paymentDetails con descuento autorizado si existe
  const enrichedPaymentDetails = typeof paymentDetails === 'object' && paymentDetails !== null ? { ...paymentDetails } : {};
  if (appliedDiscount > 0) {
    enrichedPaymentDetails.discount = {
      amount: appliedDiscount,
      ...(discountDetails && typeof discountDetails === 'object' ? discountDetails : {}),
    };
  }

  // Función auxiliar para descontar stock de forma atómica en D1
  async function deductStockAndTriggerReorder() {
    if (env && env.DB) {
      try {
        const updateStatements = orderItems.map((item) =>
          env.DB.prepare(
            'UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
          ).bind(item.quantity, item.id)
        );
        await env.DB.batch(updateStatements);
        await checkAndTriggerAutoReorder(env, orderItems.map((i) => i.id));
      } catch (err) {
        console.error('Error descontando stock en D1:', err);
      }
    } else {
      for (const item of orderItems) {
        const p = dbMap.get(item.id);
        if (p) p.stock = Math.max(0, p.stock - item.quantity);
      }
    }
  }

  if (skipShipday) {
    await deductStockAndTriggerReorder();

    if (env && env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO orders (order_number, shipday_order_id, order_type, customer_name, customer_phone, customer_address, payment_method, subtotal, delivery_fee, total, carrier_id, carrier_name, tracking_link, items_json, created_at, payment_status, payment_details, customer_doc)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            orderNumber,
            null,
            orderType,
            resolvedName,
            resolvedPhone,
            fullAddress,
            paymentMethod,
            itemsSubtotal,
            0,
            totalOrderCost,
            null,
            null,
            null,
            JSON.stringify(orderItems),
            `${expectedDeliveryDate} ${expectedDeliveryTime}`,
            paymentStatus,
            JSON.stringify(enrichedPaymentDetails),
            String(customerDoc || '').trim()
          )
          .run();
      } catch (err) {
        console.error('Error guardando orden en D1 (skipShipday):', err);
      }
    }

    return jsonResponse({
      ok: true,
      orderId: null,
      orderNumber,
      orderType,
      assigned: false,
      assignedCarrierId: null,
      assignedCarrierName: null,
      orderState: 'COMPLETED_AT_COUNTER',
      trackingLink: null,
      totalOrderCost,
      deliveryFee: 0,
      expectedDeliveryDate,
      expectedDeliveryTime,
      customerAddress: fullAddress,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      customerDoc,
      items: orderItems,
    });
  }

  const modeTag =
    orderType === 'pickup'
      ? '[RECOGER EN LOCAL - SIN DOMICILIO]'
      : orderType === 'pos_counter'
      ? '[VENTA EN MOSTRADOR POS - SIN DOMICILIO]'
      : '[DOMICILIO EXPRESS]';

  const combinedInstructions = [
    modeTag,
    `Pago: ${paymentLabel} | Total COP $${totalOrderCost.toLocaleString('es-CO')}`,
    deliveryInstruction ? `Nota: ${deliveryInstruction.trim()}` : '',
    'Verificar mayoría de edad (+18).',
  ]
    .filter(Boolean)
    .join(' · ');

  const shipdayPayload = {
    orderNumber,
    customerName: resolvedName,
    customerAddress: fullAddress,
    customerEmail: (customerEmail || 'cliente@mucadele.com').trim(),
    customerPhoneNumber: normalizeColombianPhone(resolvedPhone),
    restaurantName: STORE_CONFIG.name,
    restaurantAddress: STORE_CONFIG.address,
    restaurantPhoneNumber: STORE_CONFIG.phoneNumber,
    pickupLatitude: STORE_CONFIG.latitude,
    pickupLongitude: STORE_CONFIG.longitude,
    expectedDeliveryDate,
    expectedDeliveryTime,
    deliveryInstruction: combinedInstructions,
    orderItem: orderItems.map((it) => ({
      name: it.name,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
    })),
    totalOrderCost,
    deliveryFee: effectiveDeliveryFee,
    tips: Number(tips || 0),
    tax: 0,
    discountAmount: 0,
    paymentMethod: paymentMethod === 'cash' ? 'cash' : 'credit_card',
  };

  try {
    const insertResp = await fetch(`${SHIPDAY_API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(shipdayPayload),
    });

    const insertData = await insertResp.json().catch(() => ({}));
    if (!insertResp.ok || insertData.success === false) {
      return jsonResponse(
        {
          ok: false,
          error: insertData.response || 'No fue posible registrar la orden en Shipday.',
          details: insertData,
        },
        502
      );
    }

    // Orden confirmada en Shipday: descontar stock atómicamente en D1
    await deductStockAndTriggerReorder();

    const orderId = insertData.orderId;
    let assigned = false;
    let assignedDriverName = null;

    const shouldAssignDriver = !isNoDelivery && autoAssignDriver && orderId;
    if (shouldAssignDriver) {
      const assignResp = await fetch(
        `${SHIPDAY_API_URL}/orders/assign/${orderId}/${targetCarrierId}`,
        {
          method: 'PUT',
          headers,
        }
      );
      if (assignResp.ok) {
        assigned = true;
        assignedDriverName = targetCarrierName;
      }
    }

    let trackingLink = null;
    let orderState = isNoDelivery
      ? 'PICKUP_AT_STORE'
      : assigned
      ? 'ASSIGNED'
      : 'NOT_ASSIGNED';

    if (!isNoDelivery) {
      try {
        const detailResp = await fetch(
          `${SHIPDAY_API_URL}/orders/${encodeURIComponent(orderNumber)}`,
          { headers }
        );
        if (detailResp.ok) {
          const detailJson = await detailResp.json();
          if (Array.isArray(detailJson) && detailJson.length > 0) {
            trackingLink = detailJson[0].trackingLink || null;
            orderState = detailJson[0]?.orderStatus?.orderState || orderState;
          }
        }
      } catch {}
    }

    if (env && env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO orders (order_number, shipday_order_id, order_type, customer_name, customer_phone, customer_address, payment_method, subtotal, delivery_fee, total, carrier_id, carrier_name, tracking_link, items_json, created_at, payment_status, payment_details, customer_doc)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            orderNumber,
            orderId || null,
            orderType,
            resolvedName,
            resolvedPhone,
            fullAddress,
            paymentMethod,
            itemsSubtotal,
            effectiveDeliveryFee,
            totalOrderCost,
            assigned ? targetCarrierId : null,
            assignedDriverName,
            trackingLink,
            JSON.stringify(orderItems),
            `${expectedDeliveryDate} ${expectedDeliveryTime}`,
            paymentStatus,
            JSON.stringify(enrichedPaymentDetails),
            String(customerDoc || '').trim()
          )
          .run();
      } catch (err) {
        console.error('Error guardando orden en D1 (con Shipday):', err);
      }
    }

    return jsonResponse({
      ok: true,
      orderId,
      orderNumber,
      orderType,
      assigned,
      assignedCarrierId: assigned ? targetCarrierId : null,
      assignedCarrierName: assignedDriverName,
      orderState,
      trackingLink,
      totalOrderCost,
      deliveryFee: effectiveDeliveryFee,
      expectedDeliveryDate,
      expectedDeliveryTime,
      customerAddress: fullAddress,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      customerDoc,
      items: orderItems,
    });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err.message || 'Error interno procesando el pedido.' },
      500
    );
  }
}

// --- Cotizador Geodésico y Vial para Domicilios en Santa Marta ---
function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function estimateSantaMartaDeliveryFee(deliveryLat, deliveryLng) {
  // Coordenadas oficiales de Mucadele Licores (Calle 11 # 24-36, Santa Marta)
  const storeLat = STORE_CONFIG.latitude || 11.24383;
  const storeLng = STORE_CONFIG.longitude || -74.186437;

  // Bounding box metropolitano de Santa Marta
  const inMetroArea = deliveryLat >= 11.05 && deliveryLat <= 11.35 && deliveryLng >= -74.30 && deliveryLng <= -74.10;
  if (!inMetroArea) {
    return {
      straight_distance_km: 0,
      road_distance_km: 0,
      base_fare: 6000,
      extra_km_fare: 0,
      tech_fee: 0,
      total_fare: 6000,
      note: 'Tarifa plana de zona estándar Santa Marta.',
    };
  }

  const straightDist = calculateHaversineDistanceKm(storeLat, storeLng, deliveryLat, deliveryLng);
  // Factor vial 1.35x para recorrido vehicular en Santa Marta
  const roadDist = straightDist * 1.35;

  const baseFare = 5000;
  const baseKm = 2.0;
  const pricePerKm = 1380;
  const techFee = 600;

  let extraFare = 0;
  if (roadDist > baseKm) {
    extraFare = (roadDist - baseKm) * pricePerKm;
  }

  const rawFare = baseFare + extraFare + techFee;
  // Redondeo comercial al alza a múltiplos de $500 COP
  const totalFare = Math.max(6000, Math.ceil(rawFare / 500) * 500);

  return {
    straight_distance_km: Number(straightDist.toFixed(2)),
    road_distance_km: Number(roadDist.toFixed(2)),
    base_fare: baseFare,
    extra_km_fare: Math.round(extraFare),
    tech_fee: techFee,
    total_fare: totalFare,
  };
}

async function handleShippingEstimate(request, env) {
  const url = new URL(request.url);
  const latStr = url.searchParams.get('lat');
  const lngStr = url.searchParams.get('lng');

  if (!latStr || !lngStr) {
    return jsonResponse({
      ok: true,
      estimate: {
        road_distance_km: 0,
        total_fare: 6000,
        note: 'Tarifa base estándar de domicilio ($6.000 COP).',
      },
    });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return jsonResponse({ ok: false, error: 'Coordenadas geográficas inválidas.' }, 400);
  }

  const estimate = estimateSantaMartaDeliveryFee(lat, lng);
  return jsonResponse({ ok: true, estimate });
}

// --- Acciones Rápidas de Despacho Shipday (/api/admin/orders/*) ---
async function handleShipdayOrderActions(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  const url = new URL(request.url);
  const path = url.pathname;
  const headers = getShipdayHeaders(env);

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Método no permitido.' }, 405);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {}

  // 1. Marcar pedido listo para recoger (/api/admin/orders/ready-to-pickup)
  if (path === '/api/admin/orders/ready-to-pickup') {
    const orderId = body.order_id || body.orderId;
    if (!orderId) {
      return jsonResponse({ ok: false, error: 'order_id es obligatorio.' }, 400);
    }

    try {
      const resp = await fetch(`${SHIPDAY_API_URL}/orders/ready-to-pickup/${encodeURIComponent(orderId)}`, {
        method: 'POST',
        headers,
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        return jsonResponse({ ok: false, error: `Shipday error: ${resp.status} ${errText}` }, resp.status);
      }

      if (env && env.DB) {
        await env.DB.prepare(
          "UPDATE orders SET order_state = 'READY_TO_PICKUP' WHERE shipday_order_id = ?"
        ).bind(Number(orderId)).run().catch(() => {});
      }

      return jsonResponse({ ok: true, message: 'Pedido marcado como LISTO PARA RECOGER en Shipday.' });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error comunicando con Shipday: ' + err.message }, 500);
    }
  }

  // 2. Asignar domiciliario a la orden (/api/admin/orders/assign)
  if (path === '/api/admin/orders/assign') {
    const orderId = body.order_id || body.orderId;
    const carrierId = body.carrier_id || body.carrierId;
    const carrierName = (body.carrier_name || 'Motorizado Asignado').trim();

    if (!orderId || !carrierId) {
      return jsonResponse({ ok: false, error: 'order_id y carrier_id son obligatorios.' }, 400);
    }

    try {
      const resp = await fetch(`${SHIPDAY_API_URL}/orders/assign/${encodeURIComponent(orderId)}/${encodeURIComponent(carrierId)}`, {
        method: 'PUT',
        headers,
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        return jsonResponse({ ok: false, error: `Shipday error: ${resp.status} ${errText}` }, resp.status);
      }

      if (env && env.DB) {
        await env.DB.prepare(
          "UPDATE orders SET carrier_id = ?, carrier_name = ?, order_state = 'ASSIGNED' WHERE shipday_order_id = ?"
        ).bind(Number(carrierId), carrierName, Number(orderId)).run().catch(() => {});
      }

      return jsonResponse({ ok: true, message: `Orden asignada exitosamente a ${carrierName}.` });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error asignando motorizado en Shipday: ' + err.message }, 500);
    }
  }

  // 3. Desasignar domiciliario (/api/admin/orders/unassign)
  if (path === '/api/admin/orders/unassign') {
    const orderId = body.order_id || body.orderId;
    if (!orderId) {
      return jsonResponse({ ok: false, error: 'order_id es obligatorio.' }, 400);
    }

    try {
      const resp = await fetch(`${SHIPDAY_API_URL}/orders/unassign/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers,
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        return jsonResponse({ ok: false, error: `Shipday error: ${resp.status} ${errText}` }, resp.status);
      }

      if (env && env.DB) {
        await env.DB.prepare(
          "UPDATE orders SET carrier_id = NULL, carrier_name = NULL, order_state = 'NOT_ASSIGNED' WHERE shipday_order_id = ?"
        ).bind(Number(orderId)).run().catch(() => {});
      }

      return jsonResponse({ ok: true, message: 'Domiciliario desasignado de la orden.' });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error desasignando en Shipday: ' + err.message }, 500);
    }
  }

  return jsonResponse({ ok: false, error: 'Acción de despacho no reconocida.' }, 404);
}

// --- Receptor Webhook de Shipday (/api/webhooks/shipday) ---
async function handleShipdayWebhook(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Método no permitido.' }, 405);
  }

  let event = {};
  try {
    event = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Payload JSON inválido.' }, 400);
  }

  const orderId = event.orderId || event.order_id;
  const orderNumber = event.orderNumber || event.order_number;
  const status = (event.orderStatus || event.status || event.event || '').toUpperCase();
  const carrier = event.carrier || {};
  const carrierId = carrier.id ? Number(carrier.id) : null;
  const carrierName = carrier.name || null;

  if (!orderId && !orderNumber) {
    return jsonResponse({ ok: true, ignored: true, reason: 'Sin identificador de orden' });
  }

  if (env && env.DB) {
    try {
      let isDelivered = status.includes('DELIVERED');
      if (isDelivered) {
        await env.DB.prepare(
          `UPDATE orders 
           SET order_state = ?, 
               delivered_at = CURRENT_TIMESTAMP,
               carrier_id = COALESCE(?, carrier_id),
               carrier_name = COALESCE(?, carrier_name)
           WHERE order_number = ? OR shipday_order_id = ?`
        ).bind(status, carrierId, carrierName, orderNumber || '', Number(orderId) || 0).run();
      } else {
        await env.DB.prepare(
          `UPDATE orders 
           SET order_state = ?,
               carrier_id = COALESCE(?, carrier_id),
               carrier_name = COALESCE(?, carrier_name)
           WHERE order_number = ? OR shipday_order_id = ?`
        ).bind(status, carrierId, carrierName, orderNumber || '', Number(orderId) || 0).run();
      }
    } catch (err) {
      console.error('Error procesando webhook Shipday en D1:', err);
    }
  }

  return jsonResponse({ ok: true, received: true, status });
}

// ============================================================================
// SUBSISTEMA DE FACTURACIÓN ELECTRÓNICA DIAN UBL 2.1 (SOFTWARE PROPIO)
// ============================================================================

/**
 * Calcula el Código Único de Factura Electrónica (CUFE) según Anexo Técnico 1.9 DIAN.
 * Algoritmo: SHA-384
 * CUFE = SHA-384(NumFac + FecFac + HorFac + ValFac + CodImp1 + ValImp1 + CodImp2 + ValImp2 + CodImp3 + ValImp3 + ValTot + NitOfe + NumAdq + ClTec + TipoAmb)
 */
async function calculateCUFE({
  numFac,
  fecFac,
  horFac,
  valFac,
  codImp1 = '01',
  valImp1 = 0,
  codImp2 = '04',
  valImp2 = 0,
  codImp3 = '03',
  valImp3 = 0,
  valTot,
  nitOfe,
  numAdq,
  clTec,
  tipoAmb = '2',
}) {
  const vFac = Number(valFac || 0).toFixed(2);
  const vImp1 = Number(valImp1 || 0).toFixed(2);
  const vImp2 = Number(valImp2 || 0).toFixed(2);
  const vImp3 = Number(valImp3 || 0).toFixed(2);
  const vTot = Number(valTot || 0).toFixed(2);

  const raw = `${numFac}${fecFac}${horFac}${vFac}${codImp1}${vImp1}${codImp2}${vImp2}${codImp3}${vImp3}${vTot}${nitOfe}${numAdq}${clTec}${tipoAmb}`;
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-384', enc.encode(raw));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Calcula el SoftwareSecurityCode según Anexo Técnico 1.9 DIAN.
 * Algoritmo: SHA-384(SoftwareID + Pin + NumFac)
 */
async function calculateSoftwareSecurityCode(softwareId, pin, numFac) {
  const raw = `${softwareId}${pin}${numFac}`;
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-384', enc.encode(raw));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Genera la cadena de datos estandarizada para el código QR DIAN.
 */
function buildDIANQRCode({
  numFac,
  fecFac,
  horFac,
  nitOfe,
  numAdq,
  valFac,
  valIva = 0,
  valOtroImp = 0,
  valTot,
  cufe,
}) {
  const vFac = Number(valFac || 0).toFixed(2);
  const vIva = Number(valIva || 0).toFixed(2);
  const vOtro = Number(valOtroImp || 0).toFixed(2);
  const vTot = Number(valTot || 0).toFixed(2);
  return `NumFac: ${numFac}\nFecFac: ${fecFac}\nHorFac: ${horFac}\nNitFac: ${nitOfe}\nDocAdq: ${numAdq}\nValFac: ${vFac}\nValIva: ${vIva}\nValOtroImp: ${vOtro}\nValTotal: ${vTot}\nCUFE: ${cufe}\nQRCode: https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
}

/**
 * Construye el documento XML UBL 2.1 canónico de la DIAN conforme al Anexo Técnico 1.9
 */
function buildUBL21InvoiceXML({ config, invoice, items, customer, securityCode }) {
  const numFac = `${invoice.prefix}${invoice.consecutive}`;
  const valFac = Number(invoice.subtotal).toFixed(2);
  const valIva = Number(invoice.tax_iva || 0).toFixed(2);
  const valTot = Number(invoice.total).toFixed(2);

  const escapeXml = (str) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const lineItemsXml = (items || []).map((item, idx) => {
    const lineNum = idx + 1;
    const qty = Number(item.quantity || 1).toFixed(2);
    const unitPrice = Number(item.price || item.unit_price || 0).toFixed(2);
    const lineTotal = (Number(qty) * Number(unitPrice)).toFixed(2);
    const itemName = escapeXml(item.name || item.product_name || `Producto #${lineNum}`);
    const itemCode = escapeXml(item.id || item.product_id || `ITEM-${lineNum}`);

    return `  <cac:InvoiceLine>
    <cbc:ID>${lineNum}</cbc:ID>
    <cbc:InvoicedQuantity unitCode="EA">${qty}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="COP">${lineTotal}</cbc:LineExtensionAmount>
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>
      <cac:TaxSubtotal>
        <cbc:TaxableAmount currencyID="COP">${lineTotal}</cbc:TaxableAmount>
        <cbc:TaxAmount currencyID="COP">0.00</cbc:TaxAmount>
        <cac:TaxCategory>
          <cbc:Percent>0.00</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID>01</cbc:ID>
            <cbc:Name>IVA</cbc:Name>
          </cac:TaxScheme>
        </cac:TaxCategory>
      </cac:TaxSubtotal>
    </cac:TaxTotal>
    <cac:Item>
      <cbc:Description>${itemName}</cbc:Description>
      <cac:SellersItemIdentification>
        <cbc:ID>${itemCode}</cbc:ID>
      </cac:SellersItemIdentification>
      <cac:StandardItemIdentification>
        <cbc:ID schemeID="999">${itemCode}</cbc:ID>
      </cac:StandardItemIdentification>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="COP">${unitPrice}</cbc:PriceAmount>
      <cbc:BaseQuantity unitCode="EA">1.00</cbc:BaseQuantity>
    </cac:Price>
  </cac:InvoiceLine>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
  xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
  xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
  xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
  xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"
  xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1"
  xmlns:xades="http://uri.etsi.org/01903/v1.3.2#"
  xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd">
  <ext:UBLExtensions>
    <ext:UBLExtension>
      <ext:ExtensionContent>
        <sts:DianExtensions>
          <sts:InvoiceControl>
            <sts:InvoiceAuthorization>${escapeXml(config.resolution_number)}</sts:InvoiceAuthorization>
            <sts:AuthorizationPeriod>
              <cbc:StartDate>${escapeXml(config.resolution_date)}</cbc:StartDate>
              <cbc:EndDate>${escapeXml(config.valid_until)}</cbc:EndDate>
            </sts:AuthorizationPeriod>
            <sts:AuthorizedInvoices>
              <sts:Prefix>${escapeXml(config.prefix)}</sts:Prefix>
              <sts:From>${config.range_from}</sts:From>
              <sts:To>${config.range_to}</sts:To>
            </sts:AuthorizedInvoices>
          </sts:InvoiceControl>
          <sts:InvoiceSource>
            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1">CO</cbc:IdentificationCode>
          </sts:InvoiceSource>
          <sts:SoftwareProvider>
            <sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="${escapeXml(config.issuer_dv)}" schemeName="31">${escapeXml(config.issuer_nit)}</sts:ProviderID>
            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${escapeXml(config.software_id)}</sts:SoftwareID>
          </sts:SoftwareProvider>
          <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${escapeXml(securityCode)}</sts:SoftwareSecurityCode>
          <sts:AuthorizationProvider>
            <sts:AuthorizationProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="4" schemeName="31">800197268</sts:AuthorizationProviderID>
          </sts:AuthorizationProvider>
          <sts:QRCode>${escapeXml(invoice.qr_data)}</sts:QRCode>
        </sts:DianExtensions>
      </ext:ExtensionContent>
    </ext:UBLExtension>
  </ext:UBLExtensions>
  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>10</cbc:CustomizationID>
  <cbc:ProfileID>DIAN 2.1: Factura Electrónica de Venta</cbc:ProfileID>
  <cbc:ProfileExecutionID>${escapeXml(config.environment)}</cbc:ProfileExecutionID>
  <cbc:ID>${escapeXml(numFac)}</cbc:ID>
  <cbc:UUID schemeID="${escapeXml(config.environment)}" schemeName="CUFE-SHA384">${escapeXml(invoice.cufe)}</cbc:UUID>
  <cbc:IssueDate>${escapeXml(invoice.issue_date)}</cbc:IssueDate>
  <cbc:IssueTime>${escapeXml(invoice.issue_time)}</cbc:IssueTime>
  <cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode>
  <cbc:Note>Factura Electrónica generada por Software Propio Mucadele ERP POS</cbc:Note>
  <cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>
  <cbc:LineCountNumeric>${items ? items.length : 1}</cbc:LineCountNumeric>
  <cac:AccountingSupplierParty>
    <cbc:AdditionalAccountID>2</cbc:AdditionalAccountID>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${escapeXml(config.issuer_name)}</cbc:Name>
      </cac:PartyName>
      <cac:PhysicalLocation>
        <cac:Address>
          <cbc:ID>47001</cbc:ID>
          <cbc:CityName>Santa Marta</cbc:CityName>
          <cbc:CountrySubentity>Magdalena</cbc:CountrySubentity>
          <cbc:CountrySubentityCode>47</cbc:CountrySubentityCode>
          <cac:AddressLine>
            <cbc:Line>${escapeXml(config.issuer_address)}</cbc:Line>
          </cac:AddressLine>
          <cac:Country>
            <cbc:IdentificationCode>CO</cbc:IdentificationCode>
            <cbc:Name languageID="es">Colombia</cbc:Name>
          </cac:Country>
        </cac:Address>
      </cac:PhysicalLocation>
      <cac:PartyTaxScheme>
        <cbc:RegistrationName>${escapeXml(config.issuer_name)}</cbc:RegistrationName>
        <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="${escapeXml(config.issuer_dv)}" schemeName="31">${escapeXml(config.issuer_nit)}</cbc:CompanyID>
        <cbc:TaxLevelCode listName="48">O-48</cbc:TaxLevelCode>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${escapeXml(config.issuer_name)}</cbc:RegistrationName>
        <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="${escapeXml(config.issuer_dv)}" schemeName="31">${escapeXml(config.issuer_nit)}</cbc:CompanyID>
      </cac:PartyLegalEntity>
      <cac:Contact>
        <cbc:Telephone>${escapeXml(config.issuer_phone)}</cbc:Telephone>
        <cbc:ElectronicMail>${escapeXml(config.issuer_email)}</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cbc:AdditionalAccountID>2</cbc:AdditionalAccountID>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${escapeXml(customer.name)}</cbc:Name>
      </cac:PartyName>
      <cac:PhysicalLocation>
        <cac:Address>
          <cbc:ID>47001</cbc:ID>
          <cbc:CityName>Santa Marta</cbc:CityName>
          <cbc:CountrySubentity>Magdalena</cbc:CountrySubentity>
          <cbc:CountrySubentityCode>47</cbc:CountrySubentityCode>
          <cac:AddressLine>
            <cbc:Line>${escapeXml(customer.address || 'Santa Marta')}</cbc:Line>
          </cac:AddressLine>
          <cac:Country>
            <cbc:IdentificationCode>CO</cbc:IdentificationCode>
            <cbc:Name languageID="es">Colombia</cbc:Name>
          </cac:Country>
        </cac:Address>
      </cac:PhysicalLocation>
      <cac:PartyTaxScheme>
        <cbc:RegistrationName>${escapeXml(customer.name)}</cbc:RegistrationName>
        <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="" schemeName="${escapeXml(customer.doc_type || '13')}">${escapeXml(customer.doc_number || customer.doc || '222222222222')}</cbc:CompanyID>
        <cbc:TaxLevelCode listName="49">R-99-PN</cbc:TaxLevelCode>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${escapeXml(customer.name)}</cbc:RegistrationName>
        <cbc:CompanyID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="" schemeName="${escapeXml(customer.doc_type || '13')}">${escapeXml(customer.doc_number || customer.doc || '222222222222')}</cbc:CompanyID>
      </cac:PartyLegalEntity>
      <cac:Contact>
        <cbc:Telephone>${escapeXml(customer.phone || '+573000000000')}</cbc:Telephone>
        <cbc:ElectronicMail>${escapeXml(customer.email || 'consumidorfinal@dian.gov.co')}</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:PaymentMeans>
    <cbc:ID>1</cbc:ID>
    <cbc:PaymentMeansCode>${escapeXml(invoice.payment_method || '10')}</cbc:PaymentMeansCode>
    <cbc:PaymentDueDate>${escapeXml(invoice.issue_date)}</cbc:PaymentDueDate>
  </cac:PaymentMeans>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="COP">${valIva}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="COP">${valFac}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="COP">${valIva}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:Percent>0.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="COP">${valFac}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="COP">${valFac}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="COP">${valTot}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="COP">${valTot}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
${lineItemsXml}
</Invoice>`;
}

async function handleAdminDian(request, env) {
  const user = await verifySession(request, env);
  if (!user) {
    return jsonResponse({ ok: false, error: 'No autorizado' }, 401);
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // 1. GET /api/admin/dian/config
  if (path === '/api/admin/dian/config' && request.method === 'GET') {
    if (!env || !env.DB) return jsonResponse({ ok: false, error: 'DB no disponible' }, 500);
    const config = await env.DB.prepare('SELECT * FROM dian_config WHERE id = 1').first();
    return jsonResponse({ ok: true, config: config || {} });
  }

  // 2. POST /api/admin/dian/config (Solo Admin)
  if (path === '/api/admin/dian/config' && request.method === 'POST') {
    if (!isAdminUser(user)) return jsonResponse({ ok: false, error: 'Requiere rol Administrador' }, 403);
    const body = await request.json().catch(() => ({}));
    if (!env || !env.DB) return jsonResponse({ ok: false, error: 'DB no disponible' }, 500);

    await env.DB.prepare(
      `UPDATE dian_config SET
        environment = COALESCE(?, environment),
        software_id = COALESCE(?, software_id),
        software_pin = COALESCE(?, software_pin),
        test_set_id = COALESCE(?, test_set_id),
        technical_key = COALESCE(?, technical_key),
        resolution_number = COALESCE(?, resolution_number),
        resolution_date = COALESCE(?, resolution_date),
        prefix = COALESCE(?, prefix),
        range_from = COALESCE(?, range_from),
        range_to = COALESCE(?, range_to),
        current_consecutive = COALESCE(?, current_consecutive),
        valid_until = COALESCE(?, valid_until),
        issuer_nit = COALESCE(?, issuer_nit),
        issuer_dv = COALESCE(?, issuer_dv),
        issuer_name = COALESCE(?, issuer_name),
        issuer_trade_name = COALESCE(?, issuer_trade_name),
        issuer_address = COALESCE(?, issuer_address),
        issuer_phone = COALESCE(?, issuer_phone),
        issuer_email = COALESCE(?, issuer_email),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`
    ).bind(
      body.environment, body.software_id, body.software_pin, body.test_set_id,
      body.technical_key, body.resolution_number, body.resolution_date,
      body.prefix, body.range_from, body.range_to, body.current_consecutive,
      body.valid_until, body.issuer_nit, body.issuer_dv, body.issuer_name,
      body.issuer_trade_name, body.issuer_address, body.issuer_phone, body.issuer_email
    ).run();

    const updated = await env.DB.prepare('SELECT * FROM dian_config WHERE id = 1').first();
    return jsonResponse({ ok: true, config: updated });
  }

  // 3. GET /api/admin/dian/invoices
  if (path === '/api/admin/dian/invoices' && request.method === 'GET') {
    if (!env || !env.DB) return jsonResponse({ ok: false, error: 'DB no disponible' }, 500);
    const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 100);
    const rows = await env.DB.prepare(
      'SELECT id, order_number, invoice_number, prefix, consecutive, cufe, issue_date, issue_time, customer_name, customer_doc, total, status, created_at FROM dian_invoices ORDER BY id DESC LIMIT ?'
    ).bind(limit).all();
    return jsonResponse({ ok: true, invoices: rows.results || [] });
  }

  // 4. GET /api/admin/dian/invoices/:id/xml
  if (path.startsWith('/api/admin/dian/invoices/') && path.endsWith('/xml') && request.method === 'GET') {
    if (!env || !env.DB) return jsonResponse({ ok: false, error: 'DB no disponible' }, 500);
    const parts = path.split('/');
    const invId = parts[parts.length - 2];
    const invoice = await env.DB.prepare('SELECT invoice_number, xml_signed FROM dian_invoices WHERE id = ? OR invoice_number = ?').bind(invId, invId).first();
    if (!invoice || !invoice.xml_signed) {
      return new Response('Factura XML no encontrada', { status: 404 });
    }
    return new Response(invoice.xml_signed, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': `attachment; filename="${invoice.invoice_number}.xml"`,
        ...CORS_HEADERS,
      },
    });
  }

  // 5. POST /api/admin/dian/generate-invoice
  if (path === '/api/admin/dian/generate-invoice' && request.method === 'POST') {
    if (!env || !env.DB) return jsonResponse({ ok: false, error: 'DB no disponible' }, 500);
    const body = await request.json().catch(() => ({}));
    const config = await env.DB.prepare('SELECT * FROM dian_config WHERE id = 1').first();
    if (!config) return jsonResponse({ ok: false, error: 'Configuración DIAN no encontrada' }, 500);

    const consecutive = Number(config.current_consecutive) || 1;
    const prefix = config.prefix || 'SETP';
    const invoiceNumber = `${prefix}${consecutive}`;

    // Fecha y hora oficial Colombia (UTC-5)
    const nowBogota = new Date(Date.now() - 5 * 3600 * 1000);
    const issueDate = nowBogota.toISOString().slice(0, 10);
    const issueTime = nowBogota.toISOString().slice(11, 19) + '-05:00';

    const subtotal = Number(body.subtotal || body.total || 0);
    const taxIva = Number(body.tax_iva || 0);
    const taxInc = Number(body.tax_inc || 0);
    const total = Number(body.total || subtotal);

    const customer = {
      name: body.customer_name || 'Consumidor Final',
      doc_type: body.customer_doc_type || '13',
      doc_number: body.customer_doc || '222222222222',
      email: body.customer_email || 'facturacion@mucadele.com.co',
      phone: body.customer_phone || '+573184131391',
      address: body.customer_address || 'Santa Marta, Magdalena',
    };

    // Calcular CUFE Anexo Técnico 1.9
    const cufe = await calculateCUFE({
      numFac: invoiceNumber,
      fecFac: issueDate,
      horFac: issueTime,
      valFac: subtotal,
      codImp1: '01',
      valImp1: taxIva,
      codImp2: '04',
      valImp2: taxInc,
      codImp3: '03',
      valImp3: 0,
      valTot: total,
      nitOfe: config.issuer_nit,
      numAdq: customer.doc_number,
      clTec: config.technical_key,
      tipoAmb: config.environment || '2',
    });

    const securityCode = await calculateSoftwareSecurityCode(config.software_id, config.software_pin, invoiceNumber);
    const qrData = buildDIANQRCode({
      numFac: invoiceNumber,
      fecFac: issueDate,
      horFac: issueTime,
      nitOfe: config.issuer_nit,
      numAdq: customer.doc_number,
      valFac: subtotal,
      valIva: taxIva,
      valOtroImp: taxInc,
      valTot: total,
      cufe,
    });

    const items = body.items || [
      { id: 'PROD-01', name: 'Consumo Licorería / Venta Mostrador', quantity: 1, price: total },
    ];

    const xml = buildUBL21InvoiceXML({
      config,
      invoice: { prefix, consecutive, cufe, qr_data: qrData, issue_date: issueDate, issue_time: issueTime, subtotal, tax_iva: taxIva, total, payment_method: body.payment_method || '10' },
      items,
      customer,
      securityCode,
    });

    // Guardar en dian_invoices e incrementar consecutivo atómicamente
    await env.DB.prepare(
      `INSERT INTO dian_invoices (
        order_number, invoice_number, prefix, consecutive, cufe, qr_data,
        issue_date, issue_time, customer_id, customer_name, customer_doc_type,
        customer_doc, customer_email, customer_phone, payment_method,
        subtotal, tax_iva, tax_inc, total, status, xml_signed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      body.order_number || null, invoiceNumber, prefix, consecutive, cufe, qrData,
      issueDate, issueTime, body.customer_id || null, customer.name, customer.doc_type,
      customer.doc_number, customer.email, customer.phone, body.payment_method || '10',
      subtotal, taxIva, taxInc, total, 'generated', xml
    ).run();

    await env.DB.prepare(
      'UPDATE dian_config SET current_consecutive = current_consecutive + 1 WHERE id = 1'
    ).run();

    return jsonResponse({
      ok: true,
      invoice_number: invoiceNumber,
      cufe,
      qr_data: qrData,
      issue_date: issueDate,
      issue_time: issueTime,
      total,
      xml_url: `/api/admin/dian/invoices/${invoiceNumber}/xml`,
    });
  }

  // 6. POST /api/admin/dian/run-test-set (Habilitación Software Propio DIAN)
  if (path === '/api/admin/dian/run-test-set' && request.method === 'POST') {
    if (!isAdminUser(user)) return jsonResponse({ ok: false, error: 'Requiere rol Administrador' }, 403);
    if (!env || !env.DB) return jsonResponse({ ok: false, error: 'DB no disponible' }, 500);

    const config = await env.DB.prepare('SELECT * FROM dian_config WHERE id = 1').first();
    if (!config) return jsonResponse({ ok: false, error: 'Configuración DIAN no encontrada' }, 500);

    const testSetId = config.test_set_id || 'TEST-SET-MUCADELE-2026';
    const testCases = [
      { name: 'Factura 1: Venta Contado Efectivo Licor Nacional', subtotal: 54000, iva: 0, total: 54000, pay: '10', items: [{ id: 'antioqueno-azul-750', name: 'Aguardiente Antioqueño Azul 750ml', quantity: 1, price: 54000 }] },
      { name: 'Factura 2: Venta Whisky Importado Tarjeta Débito', subtotal: 160000, iva: 0, total: 160000, pay: '49', items: [{ id: 'jw-black-750', name: 'Johnnie Walker Black Label 700ml', quantity: 1, price: 160000 }] },
      { name: 'Factura 3: Venta Múltiple Cerveza + Ron Contado', subtotal: 96000, iva: 0, total: 96000, pay: '10', items: [{ id: 'six-club-dorada', name: 'Six Pack Club Colombia', quantity: 1, price: 28000 }, { id: 'ron-medellin-8-750', name: 'Ron Medellín 8 Años 750ml', quantity: 1, price: 68000 }] },
      { name: 'Factura 4: Consumidor Corporativo NIT con IVA discriminado', subtotal: 300000, iva: 57000, total: 357000, pay: '10', docType: '31', doc: '900543210', custName: 'DISTRIBUIDORA DEL CARIBE S.A.S.', items: [{ id: 'promo-evento-1', name: 'Paquete Eventos Empresariales', quantity: 1, price: 300000 }] },
      { name: 'Factura 5: Venta Mostrador Tarjeta Crédito', subtotal: 85000, iva: 0, total: 85000, pay: '48', items: [{ id: 'tequila-1800', name: 'Tequila 1800 Reposado', quantity: 1, price: 85000 }] },
      { name: 'Factura 6: Venta Domicilio Shipday Santa Marta', subtotal: 62000, iva: 0, total: 62000, pay: '10', items: [{ id: 'antioqueno-verde-750', name: 'Aguardiente Antioqueño Verde 750ml', quantity: 1, price: 52000 }, { id: 'domicilio', name: 'Servicio de Entrega Domiciliaria', quantity: 1, price: 10000 }] },
      { name: 'Factura 7: Venta Mayorista Menor con Descuento', subtotal: 210000, iva: 0, total: 210000, pay: '10', items: [{ id: 'ron-caldas-trad-750', name: 'Ron Caldas Tradicional x 4', quantity: 4, price: 52500 }] },
      { name: 'Factura 8: Factura Final de Cierre Set de Habilitación', subtotal: 120000, iva: 0, total: 120000, pay: '49', items: [{ id: 'combo-cierre', name: 'Combo Parranda Vallenata', quantity: 1, price: 120000 }] },
    ];

    const results = [];
    let currentConsecutive = Number(config.current_consecutive) || 1;
    const prefix = config.prefix || 'SETP';
    const nowBogota = new Date(Date.now() - 5 * 3600 * 1000);
    const issueDate = nowBogota.toISOString().slice(0, 10);

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const invNum = `${prefix}${currentConsecutive}`;
      const timeOffsetSeconds = i * 15;
      const issueTime = new Date(nowBogota.getTime() + timeOffsetSeconds * 1000).toISOString().slice(11, 19) + '-05:00';

      const customer = {
        name: tc.custName || 'Consumidor Final Pruebas',
        doc_type: tc.docType || '13',
        doc_number: tc.doc || '222222222222',
        email: 'facturacion@mucadele.com.co',
        phone: '+573184131391',
        address: 'Santa Marta, Magdalena',
      };

      const cufe = await calculateCUFE({
        numFac: invNum,
        fecFac: issueDate,
        horFac: issueTime,
        valFac: tc.subtotal,
        codImp1: '01',
        valImp1: tc.iva,
        codImp2: '04',
        valImp2: 0,
        codImp3: '03',
        valImp3: 0,
        valTot: tc.total,
        nitOfe: config.issuer_nit,
        numAdq: customer.doc_number,
        clTec: config.technical_key,
        tipoAmb: config.environment || '2',
      });

      const secCode = await calculateSoftwareSecurityCode(config.software_id, config.software_pin, invNum);
      const qr = buildDIANQRCode({
        numFac: invNum,
        fecFac: issueDate,
        horFac: issueTime,
        nitOfe: config.issuer_nit,
        numAdq: customer.doc_number,
        valFac: tc.subtotal,
        valIva: tc.iva,
        valOtroImp: 0,
        valTot: tc.total,
        cufe,
      });

      const xml = buildUBL21InvoiceXML({
        config,
        invoice: { prefix, consecutive: currentConsecutive, cufe, qr_data: qr, issue_date: issueDate, issue_time: issueTime, subtotal: tc.subtotal, tax_iva: tc.iva, total: tc.total, payment_method: tc.pay },
        items: tc.items,
        customer,
        securityCode: secCode,
      });

      await env.DB.prepare(
        `INSERT OR REPLACE INTO dian_invoices (
          order_number, invoice_number, prefix, consecutive, cufe, qr_data,
          issue_date, issue_time, customer_id, customer_name, customer_doc_type,
          customer_doc, customer_email, customer_phone, payment_method,
          subtotal, tax_iva, tax_inc, total, status, xml_signed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        `TEST-SET-${i + 1}`, invNum, prefix, currentConsecutive, cufe, qr,
        issueDate, issueTime, null, customer.name, customer.doc_type,
        customer.doc_number, customer.email, customer.phone, tc.pay,
        tc.subtotal, tc.iva, 0, tc.total, 'test_generated', xml
      ).run();

      results.push({
        test_case: i + 1,
        name: tc.name,
        invoice_number: invNum,
        cufe,
        total: tc.total,
        xml_url: `/api/admin/dian/invoices/${invNum}/xml`,
      });

      currentConsecutive++;
    }

    await env.DB.prepare(
      'UPDATE dian_config SET current_consecutive = ? WHERE id = 1'
    ).bind(currentConsecutive).run();

    return jsonResponse({
      ok: true,
      test_set_id: testSetId,
      total_invoices_generated: results.length,
      next_consecutive: currentConsecutive,
      results,
    });
  }

  return jsonResponse({ ok: false, error: 'Endpoint DIAN no encontrado' }, 404);
}

const PROTECTED_PREFIXES = ['/admin', '/pos', '/manual', '/clientes'];

function isProtectedPath(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return false;
  const normalized = rawPath.toLowerCase().replace(/\/+$/, '') || '/';
  for (const prefix of PROTECTED_PREFIXES) {
    if (
      normalized === prefix ||
      normalized === `${prefix}.html` ||
      normalized === `${prefix}.js` ||
      normalized.startsWith(`${prefix}/`)
    ) {
      return true;
    }
  }
  return false;
}

export default {
  async fetch(request, env) {
    try {
      const response = await this.handleRequest(request, env);
      return withSecurityHeaders(response);
    } catch (err) {
      return withSecurityHeaders(
        jsonResponse({ ok: false, error: 'Internal Server Error: ' + err.message }, 500)
      );
    }
  },

  async handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS' && path.startsWith('/api/')) {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (path === '/api/login') {
      return handleServerLogin(request, env);
    }

    if (path === '/api/logout') {
      return handleServerLogout(request);
    }

    if (path === '/api/auth') {
      return handleAuth(request, env);
    }

    if (path === '/api/catalog') {
      return handleCatalog(request, env);
    }

    if (path === '/api/admin/products') {
      return handleAdminProducts(request, env);
    }

    if (path === '/api/admin/suppliers') {
      return handleAdminSuppliers(request, env);
    }

    if (path === '/api/admin/purchase-orders') {
      return handleAdminPurchaseOrders(request, env);
    }

    if (path === '/api/admin/carriers') {
      return handleAdminCarriers(request, env);
    }

    if (path === '/api/admin/customers') {
      return handleAdminCustomers(request, env);
    }

    if (path === '/api/admin/scan-invoice') {
      return handleAdminScanInvoice(request, env);
    }

    if (path === '/api/admin/apply-invoice') {
      return handleAdminApplyInvoice(request, env);
    }

    if (path.startsWith('/api/pos/shift')) {
      return handlePosShift(request, env);
    }

    if (path === '/api/customers') {
      return handleCustomers(request, env);
    }

    if (path === '/api/shipping/estimate') {
      return handleShippingEstimate(request, env);
    }

    if (path.startsWith('/api/admin/orders/')) {
      return handleShipdayOrderActions(request, env);
    }

    if (path.startsWith('/api/admin/dian/')) {
      return handleAdminDian(request, env);
    }

    if (path === '/api/webhooks/shipday') {
      return handleShipdayWebhook(request, env);
    }

    if (path === '/api/order') {
      if (request.method === 'GET') return handleOrderGet(request, env);
      if (request.method === 'POST') return handleOrderPost(request, env);
      if (request.method === 'PATCH') return handleOrderPatch(request, env);
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Protección estricta en el Edge con normalización de rutas y slashes
    if (isProtectedPath(path)) {
      const user = await verifySession(request, env);
      if (!user) {
        if (path.toLowerCase().endsWith('.js')) {
          return new Response('// Unauthorized', {
            status: 401,
            headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store' },
          });
        }
        return renderServerLoginPage(sanitizeRedirectPath(path, '/pos.html'));
      }

      // Si el rol es cajero y pretende entrar a las pantallas de administración de inventarios/precios
      const normPath = path.toLowerCase().replace(/\/+$/, '') || '/';
      if (!isAdminUser(user) && (normPath === '/admin' || normPath === '/admin.html' || normPath.startsWith('/admin/'))) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: '/pos?denied=admin',
            'Cache-Control': 'no-store',
          },
        });
      }

      const assetResp = await env.ASSETS.fetch(request);
      const headers = new Headers(assetResp.headers);
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      return new Response(assetResp.body, {
        status: assetResp.status,
        statusText: assetResp.statusText,
        headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
};

