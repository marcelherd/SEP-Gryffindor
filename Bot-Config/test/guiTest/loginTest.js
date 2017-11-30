require('chromedriver')
const {Builder, By, Key, until} = require('selenium-webdriver')

let driver = new Builder().forBrowser('chrome').build()
driver.get('http://localhost:8080/#/Login')

// console.log(driver.findElement(driver.getTitle))
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div/div[2]/input[1]')).sendKeys('superuser')
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div/div[2]/input[2]')).sendKeys('123qwe')
driver.sleep(1000)
driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div/div/div/div[3]/button')).click()

console.log('End')
