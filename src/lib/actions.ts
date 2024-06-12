'use server';

import { revalidatePath } from 'next/cache';
import { createNewLink } from './data';
import { ILink, ILink_request } from './types';

export async function CreateNewLinkAction(formData: FormData, pathname?: string): Promise<ILink> {
    const linkReqest: ILink_request = {
        category: getFormDataName(formData, 'category'),
        description: getFormDataName(formData, 'description'),
        imageUrl: getFormDataName(formData, 'imageUrl'),
        title: getFormDataName(formData, 'title'),
        url: getFormDataName(formData, 'url'),
    };
    const linkProm = createNewLink(linkReqest);

    // Optionally refresh URL after the new link is added
    if (pathname != null) {
        linkProm.then(() => revalidatePath(pathname));
    }

    return linkProm;
}

function getFormDataName(formData: FormData, name: string): string {
    return formData.get(name)?.toString() || '';
}
