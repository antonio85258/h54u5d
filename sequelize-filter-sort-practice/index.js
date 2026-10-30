const { Op } = require('sequelize');
const sequelize = require('./database');
const {
  User,
  Post,
  Author,
  Book,
  Student,
  Course,
  Enrollment,
  Order,
  Item
} = require('./models');

async function getUsersWithRecentPosts() {
  return User.findAll({
    include: [{
      model: Post,
      as: 'posts',
      where: {
        publishedAt: {
          [Op.gt]: new Date('2023-01-01')
        }
      },
      required: true
    }],
    order: [
      ['name', 'ASC'],
      [{ model: Post, as: 'posts' }, 'publishedAt', 'DESC']
    ]
  });
}

async function getAllAuthorsIncludingEmpty() {
  return Author.findAll({
    include: [{
      model: Book,
      as: 'books',
      required: false
    }],
    order: [['lastName', 'ASC']]
  });
}

async function getStudentsInAdvancedCourses() {
  return Student.findAll({
    include: [{
      model: Course,
      as: 'courses',
      where: {
        credits: {
          [Op.gt]: 3
        }
      },
      required: true,
      through: {
        attributes: []
      }
    }],
    order: [
      ['name', 'ASC'],
      [{ model: Course, as: 'courses' }, 'title', 'ASC']
    ]
  });
}

async function getOrdersWithBulkItems() {
  return Order.findAll({
    include: [{
      model: Item,
      as: 'items',
      where: {
        quantity: {
          [Op.gt]: 2
        }
      },
      required: true
    }],
    order: [
      ['createdAt', 'DESC'],
      [{ model: Item, as: 'items' }, 'price', 'DESC']
    ]
  });
}

async function getActiveUsersWithPublishedPosts() {
  return User.findAll({
    where: {
      isActive: true
    },
    include: [{
      model: Post,
      as: 'posts',
      where: {
        status: 'published'
      },
      required: true
    }],
    order: [
      ['name', 'ASC'],
      [{ model: Post, as: 'posts' }, 'createdAt', 'DESC']
    ]
  });
}

async function seed() {
  await sequelize.sync({ force: true });

  const [user1, user2, user3] = await User.bulkCreate([
    { name: 'Антон Иванов', email: 'anton@example.com', isActive: true },
    { name: 'Мария Петрова', email: 'maria@example.com', isActive: true },
    { name: 'Иван Смирнов', email: 'ivan@example.com', isActive: false }
  ]);

  await Post.bulkCreate([
    {
      title: 'Первый проект',
      publishedAt: new Date('2022-12-15'),
      status: 'published',
      authorId: user1.id
    },
    {
      title: 'Работа с Sequelize',
      publishedAt: new Date('2023-05-20'),
      status: 'published',
      authorId: user1.id
    },
    {
      title: 'Практика Node.js',
      publishedAt: new Date('2024-02-10'),
      status: 'published',
      authorId: user2.id
    },
    {
      title: 'Черновик',
      publishedAt: new Date('2024-03-01'),
      status: 'draft',
      authorId: user2.id
    }
  ]);

  const [author1, author2, author3] = await Author.bulkCreate([
    { firstName: 'Лев', lastName: 'Толстой', country: 'Россия' },
    { firstName: 'Фёдор', lastName: 'Достоевский', country: 'Россия' },
    { firstName: 'Антон', lastName: 'Чехов', country: 'Россия' }
  ]);

  await Book.bulkCreate([
    { title: 'Война и мир', year: 1869, genre: 'Роман', authorId: author1.id },
    { title: 'Преступление и наказание', year: 1866, genre: 'Роман', authorId: author2.id }
  ]);

  const [student1, student2] = await Student.bulkCreate([
    { name: 'Алексей Орлов', group: 'ИТ-21' },
    { name: 'Елена Волкова', group: 'ИТ-22' }
  ]);

  const [course1, course2, course3] = await Course.bulkCreate([
    { title: 'Основы программирования', credits: 3 },
    { title: 'Базы данных', credits: 4 },
    { title: 'Архитектура приложений', credits: 5 }
  ]);

  await Enrollment.bulkCreate([
    { StudentId: student1.id, CourseId: course1.id, grade: 4 },
    { StudentId: student1.id, CourseId: course2.id, grade: 5 },
    { StudentId: student2.id, CourseId: course3.id, grade: 5 }
  ]);

  const [order1, order2] = await Order.bulkCreate([
    { number: 'ORD-001', status: 'paid' },
    { number: 'ORD-002', status: 'new' }
  ]);

  await Item.bulkCreate([
    { productName: 'Клавиатура', quantity: 4, price: 3500, orderId: order1.id },
    { productName: 'Мышь', quantity: 2, price: 1800, orderId: order1.id },
    { productName: 'Монитор', quantity: 3, price: 24000, orderId: order2.id },
    { productName: 'Кабель HDMI', quantity: 1, price: 900, orderId: order2.id }
  ]);
}

function printUsers(rows) {
  console.log('\nЗадание 1');
  rows.forEach(user => {
    console.log(user.name);
    console.table(user.posts.map(post => ({
      title: post.title,
      publishedAt: post.publishedAt.toISOString().slice(0, 10)
    })));
  });
}

function printAuthors(rows) {
  console.log('\nЗадание 2');
  rows.forEach(author => {
    console.log(`${author.firstName} ${author.lastName}`);
    console.table(author.books.map(book => ({
      title: book.title,
      year: book.year
    })));
  });
}

function printStudents(rows) {
  console.log('\nЗадание 3');
  rows.forEach(student => {
    console.log(student.name);
    console.table(student.courses.map(course => ({
      title: course.title,
      credits: course.credits
    })));
  });
}

function printOrders(rows) {
  console.log('\nЗадание 4');
  rows.forEach(order => {
    console.log(order.number);
    console.table(order.items.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price
    })));
  });
}

function printActiveUsers(rows) {
  console.log('\nЗадание 5');
  rows.forEach(user => {
    console.log(user.name);
    console.table(user.posts.map(post => ({
      title: post.title,
      status: post.status,
      createdAt: post.createdAt.toISOString().slice(0, 10)
    })));
  });
}

async function main() {
  try {
    await seed();

    const users = await getUsersWithRecentPosts();
    const authors = await getAllAuthorsIncludingEmpty();
    const students = await getStudentsInAdvancedCourses();
    const orders = await getOrdersWithBulkItems();
    const activeUsers = await getActiveUsersWithPublishedPosts();

    printUsers(users);
    printAuthors(authors);
    printStudents(students);
    printOrders(orders);
    printActiveUsers(activeUsers);
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

main();
