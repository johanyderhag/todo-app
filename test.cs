using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Interactions;

namespace EdgeDriverTest1
{
    [TestClass]
    public class EdgeDriverTest
    {
        private const string edgeDriverDirectory = @"C:\";
        private EdgeDriver browser;
        private const string currentPort = "5501"; //Change if needed
        private const string todoURL = "http://127.0.0.1:" + currentPort + "/index.html";


        [TestInitialize]
        public void EdgeDriverInitialize()
        {
            browser = new EdgeDriver(edgeDriverDirectory);
            browser.Url = todoURL;
        }

        [TestMethod]
        public void CheckInput()
        {
            var todoInput = browser.FindElementByCssSelector(".new-todo");
            todoInput.SendKeys("buy stuff");
            todoInput.SendKeys(Keys.Enter);

            var label = browser.FindElementByCssSelector(".main label");
            Assert.AreEqual("buy stuff", label.Text);
        }
        [TestMethod]
        public void CheckItemsLeft()
        {
            var todoInput = browser.FindElementByCssSelector(".new-todo");
            todoInput.SendKeys("buy stuff");
            todoInput.SendKeys(Keys.Enter);

            var items = browser.FindElementByCssSelector(".items-left");
            Assert.AreEqual("1 item left", items.Text);

            var checkbox = browser.FindElementByCssSelector(".main input[type='checkbox']");
            checkbox.SendKeys(Keys.Space);
            Assert.AreEqual("0 items left", items.Text);
        }

        [TestMethod]
        public void CheckItemsLeftWith3Todos()
        {
            var todoInput = browser.FindElementByCssSelector(".new-todo");
            todoInput.SendKeys("clean house");
            todoInput.SendKeys(Keys.Enter);

            todoInput.SendKeys("google brad");
            todoInput.SendKeys(Keys.Enter);

            todoInput.SendKeys("code more apps");
            todoInput.SendKeys(Keys.Enter);

            var checkbox = browser.FindElementByCssSelector(".main input[type='checkbox']");
            checkbox.SendKeys(Keys.Space);

            var items = browser.FindElementByCssSelector(".items-left");
            Assert.AreEqual("2 items left", items.Text);

        }
        [TestMethod]
        public void CheckDblClickToEdit()
        {

            var todoInput = browser.FindElementByCssSelector(".new-todo");
            todoInput.SendKeys("clean house");
            todoInput.SendKeys(Keys.Enter);

            var label = browser.FindElementByCssSelector(".main label");
            Assert.AreEqual("clean house", label.Text);

            Actions action = new Actions(browser);

            action.DoubleClick(label).Build().Perform();
            label.SendKeys(" now!");
            label.SendKeys(Keys.Enter);

            Assert.AreEqual("clean house now!", label.Text);

        }

        [TestMethod]
        public void CheckUrlChange()
        {
            var todoInput = browser.FindElementByCssSelector(".new-todo");
            todoInput.SendKeys("some input");
            todoInput.SendKeys(Keys.Enter);

            string goalUrl = todoURL + "#active";
            var activeButton = browser.FindElementByCssSelector("#active");
            activeButton.Click();
            string currentUrl = browser.Url;
            Assert.AreEqual(goalUrl, currentUrl);
        }

        [TestMethod]
        public void CheckReloadNotChangesURL()
        {
            // Needed to make butttons visible
            var todoInput = browser.FindElementByCssSelector(".new-todo");
            todoInput.SendKeys("some input");
            todoInput.SendKeys(Keys.Enter);

            string goalUrl = todoURL + "#active";
            var activeButton = browser.FindElementByCssSelector("#active");
            activeButton.Click();

            browser.Navigate().Refresh();

            string currentUrl = browser.Url;
            Assert.AreEqual(goalUrl, currentUrl);
        }

        [TestCleanup]
        public void EdgeDriverCleanup()
        {
            browser.Quit();
        }
    }
}
