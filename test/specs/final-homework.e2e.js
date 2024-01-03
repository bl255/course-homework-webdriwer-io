const userName1 = 'Test Name'
const userName2 = 'Second Test Name'
const validPassword = 'Password1234'
const invalidPasswordNumbers = '0987654321'

async function nowEmail() {
    const now = Date.now()
    return now + 'test@mail.com'
  }

class RegistrationForm {

    get fieldName() { return $('#name'); }
    get fieldEmail() { return $('#email'); }
    get fieldPassword() { return $('#password'); }
    get fieldPasswordConfirm() { return $('#password-confirm'); }
    get buttonRegister() { return $('button=Zaregistrovat');}

    async register() {
        await this.buttonRegister.click();
    }
};

describe('Navigating to registration', async () => {
    let testNumber = 1;
    const screenshotName = 'NavRegistration';

    beforeEach(async () => {
        await browser.reloadSession();
        await browser.url('/');
        const headerHome = await $('h1=Vyberte období akce')
        await (headerHome).waitForDisplayed({ timeout: 3000 });
    });

    afterEach(async () => {
        await browser.saveScreenshot(screenshotName + testNumber + '.png');
        testNumber++;

    });

    it('should navigate from homepage', async () => {
        const userLoginLink = await $('.nav-link=Přihlásit');
        await userLoginLink.click();

        const buttonRegistration = await $('.btn-secondary=Zaregistrujte se');
        await buttonRegistration.click();

        const headerRegistrastion = await $('h1=Registrace')
        await expect (headerRegistrastion).toHaveText('Registrace')
        
    });

});

describe('Registration', async () => {
    let testNumber = 1;
    const screenshotName = 'Registration';

    beforeEach(async () => {

        await browser.reloadSession();
        await browser.url('/registrace');
        await $('h1=Registrace').waitForDisplayed({ timeout: 3000 });
    
    });

    afterEach(async () => {
        await browser.saveScreenshot(screenshotName + testNumber + '.png');
        testNumber++;
    });

    it('should register with valid data', async () => {
        
        const form = new RegistrationForm

        await (form.fieldName).setValue(userName1);
        await (form.fieldEmail).setValue(await nowEmail());
        await (form.fieldPassword).setValue(validPassword);
        await (form.fieldPasswordConfirm).setValue(validPassword);

        form.register()

        const headerApplications = await $('h1=Přihlášky');
        await expect (headerApplications).toHaveText('Přihlášky');
        const buttonCreateApplication = await $('.btn-info=Vytvořit novou přihlášku');
        await expect (buttonCreateApplication).toBeDisplayed();
        const dropdownUser = await $('.navbar-right')
        const logged = 'Přihlášen ' + userName1
        await expect (dropdownUser).toHaveText(logged)
    });
    
    it('should not register with invalid email - duplicate email', async () => {
        
        const duplicateEmail = await nowEmail()
        const form = new RegistrationForm

        await (form.fieldName).setValue(userName1);
        await (form.fieldEmail).setValue(duplicateEmail);
        await (form.fieldPassword).setValue(validPassword);
        await (form.fieldPasswordConfirm).setValue(validPassword);

        form.register();
        const headerApplications = await $('h1=Přihlášky');
        await headerApplications.waitForDisplayed({ timeout: 3000 });

        await browser.reloadSession();
        await browser.url('/registrace');

        await (form.fieldName).setValue(userName2);
        await (form.fieldEmail).setValue(duplicateEmail);
        await (form.fieldPassword).setValue(validPassword);
        await (form.fieldPasswordConfirm).setValue(validPassword);

        form.register();

        const toaster = await $('.toast-message');
        await (toaster).waitForDisplayed({ timeout: 3000 });
        await expect (toaster).toHaveText('Některé pole obsahuje špatně zadanou hodnotu');
        const feedbackInvalidEmail = await $('.invalid-feedback*=Účet');
        await expect (feedbackInvalidEmail).toHaveText('Účet s tímto emailem již existuje');

    });

    it('should not register with invalid password - numbers only', async () => {
        
        const form = new RegistrationForm

        await (form.fieldName).setValue(userName1);
        await (form.fieldEmail).setValue(await nowEmail());
        await (form.fieldPassword).setValue(invalidPasswordNumbers);
        await (form.fieldPasswordConfirm).setValue(invalidPasswordNumbers);

        form.register();

        const toaster = await $('.toast-message');
        await expect (toaster).toHaveText('Některé pole obsahuje špatně zadanou hodnotu');
        const feedbackInvalidPassword = await $('.invalid-feedback*=Heslo musí');
        await expect (feedbackInvalidPassword).toHaveText('Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici');

    });
});



