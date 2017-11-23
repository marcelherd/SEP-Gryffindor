const webdriver = require('selenium-webdriver');

console.log('Start');

let driver = new webdriver.Builder().forBrowser('chrome').build();
driver.get('http://localhost:8080/#/Login');
driver.findElement(By.name('username')).sendKeys('superuser');
driver.findElement(By.name('username')).sendKeys('123qwe');
driver.quit();

console.log('End');
