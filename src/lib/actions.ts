'use server';

import { revalidatePath } from 'next/cache';
import { createNewLink } from './data';
import { ILink, ILink_request } from './types';

export async function CreateNewLinkAction(formData: FormData, pathname?: string): Promise<ILink> {
    const linkReqest: ILink_request = {
        category: formData.get('category')?.toString() || '',
        description: formData.get('description')?.toString() || '',
        imageUrl: formData.get('imageUrl')?.toString() || '',
        title: formData.get('title')?.toString() || '',
        url: formData.get('url')?.toString() || ''
    };
    const linkProm = createNewLink(linkReqest);

    // Optionally refresh the URL after a new link is added
    if (pathname != null) {
        linkProm.then(() => revalidatePath(pathname));
    }

    return linkProm;
}
