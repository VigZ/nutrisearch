class FoodAdapter {
  constructor(fg_id, maxResults = 50) {
    this.fg_id = fg_id,
    this.offset = 0
    this.maxResults = maxResults
  }

  increaseOffset() {
    this.offset += this.maxResults
  }

  decreaseOffset() {
    this.offset -= this.maxResults
  }

  fetch() {
    return fetch( `https://api.nal.usda.gov/ndb/search/?format=json&fg=${this.fg_id}&max=${this.maxResults}&offset=${this.offset}&api_key=${getKey()}`)
  }
}
