const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({})
    res.status(200).json({ products })
}
const dbOperators = {
    '>': '$gt',
    '>=': '$gte',
    '=': '$eq',
    '<': '$lt',
    '<=': '$lte',
}
const getAllProducts = async (req, res) => {

    let { sort, fields, limit, page, filters, ...query } = req.query
    sort = req.query?.sort?.split(',').join(' ') || 'name'
    fields = req.query?.fields?.split(',').join(' ') || ''
    page = +page || 1
    limit = +limit || 10
    const skip = (page - 1) * limit
    const filterObj = {}
    if(filters) {
        const allFilters = filters.split(',')

        for(let i = 0; i < allFilters.length; i++) {
            let filter = allFilters[i]
            const op = filter.match(/\b(<|<=|=|>|>=)\b/g)[0]
            const [field, value] = filter.split(op)

            filterObj[field] = { [dbOperators[op]] : +value}
        }
        Object.assign(query, filterObj)
    }
    console.log(query)
    const products = await Product.find(query).select(fields).skip(skip).limit(limit).sort(sort)
    res.status(200).json({ items: products.length, products })
}

module.exports = { getAllProducts, getAllProductsStatic }