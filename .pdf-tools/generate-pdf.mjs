import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const assets = path.join(root, 'assets')
const out = path.join(assets, 'guia-el-arte-de-sembrar.pdf')

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none']
})
const page = await browser.newPage()
await page.goto('file://' + path.join(assets, 'guia-imprimible.html'), {
  waitUntil: 'networkidle0',
  timeout: 120000
})
await page.emulateMediaType('print')
const buf = await page.pdf({
  format: 'Letter',
  printBackground: true,
  preferCSSPageSize: false,
  displayHeaderFooter: true,
  headerTemplate: fs.readFileSync(path.join(assets, '_pdf_header.html'), 'utf8'),
  footerTemplate: fs.readFileSync(path.join(assets, '_pdf_footer.html'), 'utf8'),
  margin: { top: '28mm', bottom: '22mm', left: '16mm', right: '16mm' }
})
fs.writeFileSync(out, buf)
await browser.close()
console.log('PDF', out, buf.length)
