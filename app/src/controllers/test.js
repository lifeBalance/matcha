exports.getTests = (req, res, next) => {
  // here we'd bring in a model to get data from db
  res.status(200).json({
    tests: [
      {title: 'first test', content: 'blabla'},
      {title: 'second test', content: 'blabla'}
    ]
  })
}

exports.createTest = (req, res, next) => {
  const title = req.body.title // body-parser takes care of the '.body.'
  const content = req.body.content
  // here we'd bring in a model to get data from db
  res.status(201).json({
    message: 'Da ting was Created successfully',
    test: {
      id: new Date().toISOString(),
      title: title,
      content: content
    }
  })
}