const webdriver = require('selenium-webdriver');

console.log('Start');

let driver = new webdriver.Builder().forBrowser('chrome').build();
driver.get('http://localhost:8080/#/Login');

console.log(driver);
// driver.findElement(driver.getTitle);
// driver.findElement(driver.By.type('password')).sendKeys('123qwe');
// driver.quit();

console.log('End');
