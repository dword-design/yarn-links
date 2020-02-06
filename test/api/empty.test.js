import api from 'yarn-links'

export default async () => expect(await api()).toEqual([])
