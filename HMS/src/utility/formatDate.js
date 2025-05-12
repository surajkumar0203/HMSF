const formatDate = (value) => {
    const [YYYY, MM, DD] = value.split("-")
    return `${DD}-${MM}-${YYYY}`
}

export default formatDate