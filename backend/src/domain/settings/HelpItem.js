class HelpItem {
  constructor({ id, question, answer, order }) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.order = order;
  }

  toJSON() {
    return {
      id: this.id,
      question: this.question,
      answer: this.answer,
      order: this.order,
    };
  }
}

module.exports = HelpItem;
