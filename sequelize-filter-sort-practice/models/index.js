const User = require('./User');
const Post = require('./Post');
const Author = require('./Author');
const Book = require('./Book');
const Student = require('./Student');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Order = require('./Order');
const Item = require('./Item');

User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' });
Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

Student.belongsToMany(Course, { through: Enrollment, as: 'courses' });
Course.belongsToMany(Student, { through: Enrollment, as: 'students' });

Order.hasMany(Item, { foreignKey: 'orderId', as: 'items' });
Item.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

module.exports = {
  User,
  Post,
  Author,
  Book,
  Student,
  Course,
  Enrollment,
  Order,
  Item
};
