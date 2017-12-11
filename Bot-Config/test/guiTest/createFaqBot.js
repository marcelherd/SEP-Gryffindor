require('chromedriver')
const {Builder, By, Key, until} = require('selenium-webdriver')

console.log('Start')

let driver = new Builder().forBrowser('chrome').build()
driver.get('http://localhost:8080/#/Login')

// login
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div/div[2]/input[1]')).sendKeys('superuser')
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div/div[2]/input[2]')).sendKeys('123qwe')
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div/div[3]/button')).click()
driver.sleep(1000)
// create Bot

driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/button/i')).click()
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div[1]/div/div[1]/h1')).click()
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div[2]/div/div[1]/input[1]')).sendKeys('BloedeFragenBot')
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div[2]/div/div[1]/input[2]')).sendKeys('Pass auf !!!')
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div[2]/div/div[2]/button')).click()
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[1]/div[1]/div/img')).click()
driver.sleep(1000)

