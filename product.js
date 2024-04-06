import { db } from "./db.js";

export async function addproduct(product) {
  console.log(product);
  const res = new Promise((res, rej) => {
    db.run(
      "INSERT INTO items(name, price, stock, description, image, imageType) VALUES ($name, $price, $stock, $description, $image, $imageType)",
      {
        $name: product.name,
        $price: product.price,
        $stock: product.stock,
        $description: product.description,
        $image: product.image.buffer,
        $imageType: product.image.mimetype,
      },
      (result, error) => {
        if (error) {
          rej(error);
        } else {
          res(result);
        }
      }
    );
  });
  try {
    await res;
    return true;
  } catch (error) {
    return false;
  }
}

export async function getProductImage(id) {
  const res = new Promise((res, rej) => {
    db.get(
      "SELECT image,imageType FROM items WHERE id=$id;",
      {
        $id: id,
      },
      (error, result) => {
        if (error) {
          rej(error);
        } else {
          res(result);
        }
      }
    );
  });
  try {
    await res;
    return res;
  } catch (error) {
    return null;
  }
}

export async function deleteProductById(id) {
  const res = new Promise((res, rej) => {
    db.run(
      "DELETE FROM items WHERE id=$id;",
      {
        $id: id,
      },
      function () {
        console.log(this);
        if (this.changes > 0) res();
        else rej();
      }
    );
  });
  try {
    await res;
    return true;
  } catch (error) {
    return false;
  }
}
