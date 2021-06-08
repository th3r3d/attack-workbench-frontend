import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observer } from 'rxjs';
import { Relationship } from 'src/app/classes/stix/relationship';
import { StixObject, stixTypeToAttackType } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-relationship-view',
  templateUrl: './relationship-view.component.html',
  styleUrls: ['./relationship-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelationshipViewComponent extends StixViewPage implements OnInit {

    public get relationship() { return this.config.object as Relationship; }
    public source_type: string;
    public target_type: string;
    public refresh: boolean = true;
    /** refresh the list of source objects if the type changes 
     *  This is bad code and should be done a better way.
     */
    public refresh_lists() {
        this.refresh = false;
        setTimeout(() => {
            this.refresh = true;
        })
    }

    constructor(private restApiService: RestApiConnectorService) { 
        super()
    }

    ngOnInit(): void {
        // initialize source/target types if there is a source/target object, or if there is only one possible value
        if (this.relationship.source_object) this.source_type = stixTypeToAttackType[this.relationship.source_object.stix.type]
        else if (this.relationship.valid_source_types.length == 1) this.source_type = this.relationship.valid_source_types[0];
        if (this.relationship.target_object) this.target_type = stixTypeToAttackType[this.relationship.target_object.stix.type]
        else if (this.relationship.valid_target_types.length == 1) this.target_type = this.relationship.valid_target_types[0];
    }

    public setSourceObject(object: StixObject) {
        var subscription = this.relationship.set_source_object(object).subscribe({
            complete: () => { if (subscription) subscription.unsubscribe() } //subscription doesn't exist for some reason in this case
        }) 
    }

    public setTargetObject(object: StixObject) {
        var subscription = this.relationship.set_target_object(object).subscribe({
            complete: () => { if (subscription) subscription.unsubscribe() } //subscription doesn't exist for some reason in this case
        }) 
    }

}
