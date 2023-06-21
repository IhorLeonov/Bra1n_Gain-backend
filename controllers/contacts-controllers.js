const { HttpError, ctrlWrapper } = require('../helpers');
const { Contact } = require('../models/contact.js');

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    const favoriteFilter = favorite ? { favorite: favorite } : {};

    const result = await Contact.find(
        { owner, ...favoriteFilter },
        '-createdAt -updatedAt',
        {
            skip,
            limit,
        }
    ).populate('owner', 'name email');

    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });

    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
    });
    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json(result);
};

const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
    });
    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json(result);
};

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json({
        message: 'contact deleted',
    });
};

module.exports = {
    getAll: ctrlWrapper(getAllContacts),
    getById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateById: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteById: ctrlWrapper(removeContact),
};
