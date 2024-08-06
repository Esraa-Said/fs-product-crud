const fs = require("fs").promises;
const readline = require("readline");

const path = "./products.json";

async function writeProduct(product) {
  try {
    let products = await readProducts();
    products.push(product);
    await fs.writeFile(path, JSON.stringify(products));
    console.log(`Product added: ${JSON.stringify(product)}`);
  } catch (error) {
    console.error("Error writing product:", error);
  }
}

async function readProducts() {
  try {
    const products = await fs.readFile(path, "utf-8");
    return JSON.parse(products);
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

async function deleteById(id) {
  try {
    let products = await readProducts();
    const result = products.findIndex((product) => product.productId === id);
    if (result >= 0) {
      products.splice(result, 1);
      await fs.writeFile(path, JSON.stringify(products));
      console.log(`Product with ID ${id} deleted`);
    } else {
      console.log(`Product with ID ${id} not found`);
    }
  } catch (error) {
    console.error("Error deleting product by ID:", error);
  }
}

async function deleteByName(name) {
  try {
    let products = await readProducts();
    const result = products.findIndex((product) => product.productName === name);
    if (result >= 0) {
      products.splice(result, 1);
      await fs.writeFile(path, JSON.stringify(products));
      console.log(`Product with name ${name} deleted`);
    } else {
      console.log(`Product with name ${name} not found`);
    }
  } catch (error) {
    console.error("Error deleting product by name:", error);
  }
}

async function getById(id) {
  try {
    const products = await readProducts();
    const result = products.find((product) => product.productId === id);
    console.log("Product found by ID:", result);
  } catch (error) {
    console.error("Error getting product by ID:", error);
  }
}

async function getByName(name) {
  try {
    const products = await readProducts();
    const result = products.find((product) => product.productName === name);
    console.log("Product found by name:", result);
  } catch (error) {
    console.error("Error getting product by name:", error);
  }
}

async function editName(id, name) {
  try {
    let products = await readProducts();
    const result = products.findIndex((product) => product.productId === id);
    if (result >= 0) {
      products[result].productName = name;
      await fs.writeFile(path, JSON.stringify(products));
      console.log(`Product with ID ${id} updated to name ${name}`);
    } else {
      console.log(`Product with ID ${id} not found`);
    }
  } catch (error) {
    console.error("Error editing product name:", error);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function mainMenu() {
  console.log("\nChoose an operation:");
  console.log("1: Add a product");
  console.log("2: Delete a product by ID");
  console.log("3: Delete a product by Name");
  console.log("4: Get a product by ID");
  console.log("5: Get a product by Name");
  console.log("6: Edit a product name by ID");
  console.log("7: Read all products");
  console.log("8: Exit");

  rl.question("Enter your choice: ", async (choice) => {
    switch (choice) {
      case '1':
        rl.question("Enter product ID: ", async (id) => {
          rl.question("Enter product name: ", async (name) => {
            await writeProduct({ productId: parseInt(id), productName: name });
            mainMenu();
          });
        });
        break;
      case '2':
        rl.question("Enter product ID to delete: ", async (id) => {
          await deleteById(parseInt(id));
          mainMenu();
        });
        break;
      case '3':
        rl.question("Enter product name to delete: ", async (name) => {
          await deleteByName(name);
          mainMenu();
        });
        break;
      case '4':
        rl.question("Enter product ID to get: ", async (id) => {
          await getById(parseInt(id));
          mainMenu();
        });
        break;
      case '5':
        rl.question("Enter product name to get: ", async (name) => {
          await getByName(name);
          mainMenu();
        });
        break;
      case '6':
        rl.question("Enter product ID to edit: ", async (id) => {
          rl.question("Enter new product name: ", async (name) => {
            await editName(parseInt(id), name);
            mainMenu();
          });
        });
        break;
      case '7':
        const products = await readProducts();
        console.log("Products:", products);
        mainMenu();
        break;
      case '8':
        rl.close();
        break;
      default:
        console.log("Invalid choice. Please try again.");
        mainMenu();
        break;
    }
  });
}

mainMenu();
