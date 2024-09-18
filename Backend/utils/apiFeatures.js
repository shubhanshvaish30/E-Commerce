class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
        console.log(keyword);
        
  
      this.query = this.query.find({ ...keyword });
      return this;
    }
    filterByCategory() {
        const category = this.queryStr.category && this.queryStr.category !== "All"
      ? { category: this.queryStr.category }
      : {};

    const subCategory = this.queryStr.subCategory && this.queryStr.subCategory !== "All"
      ? { subCategory: this.queryStr.subCategory }
      : {};

    this.query = this.query.find({ ...category, ...subCategory });
    return this;
      }
  
    filter() {
      const queryCopy = { ...this.queryStr };
      //   Removing some fields for category
      const removeFields = ["keyword", "page", "limit"];
  
      removeFields.forEach((key) => delete queryCopy[key]);
  
      // Filter For Price and Rating
  
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    pagination(resultPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
  
      const skip = resultPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    }
  }
  
 export default ApiFeatures